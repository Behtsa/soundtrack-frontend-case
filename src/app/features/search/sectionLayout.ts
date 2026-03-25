import type { CSSProperties } from 'react'

/**
 * Parses `editorialSearch.sections[].node.component` hints from the API.
 *
 * Each hint has the form `LayoutName?param=value&...`.
 * The array can arrive in three patterns:
 *
 * Pattern A — same layout, fixed cols per breakpoint:
 *   ["PortraitCards?from=l&cols=5&rows=1", "PortraitCards?from=m&cols=4&rows=1", "PortraitCards?cols=2&rows=2"]
 *
 * Pattern B — no breakpoints, browser decides column count (auto-fill):
 *   ["ImageCards?initialRows=2", "PortraitCards?rows=2"]
 *
 * Pattern C — different layout at large vs small viewports:
 *   ["PortraitCards?from=l&cols=5&rows=1", "PortraitCards?from=m&cols=4&rows=1", "ListItems?cols=1&rows=4"]
 */

// ---------------------------------------------------------------------------
// Hint registry — maps each hint name to the display type it renders as
// ---------------------------------------------------------------------------

/**
 * display: drives which CSS class is applied.
 *   'cards'      → image grid (ImageCards, PortraitCards, Grid)
 *   'list'       → text list (ListItems)
 *   'track-list' → compact track row (TrackList)
 */
export const HINT_DEFINITIONS = {
  ImageCards:    { display: 'cards',      description: 'Image cards; auto-fill cols. rows/initialRows limits visible rows.' },
  PortraitCards: { display: 'cards',      description: 'Portrait cards (art, playlists). Fixed cols when from= present, auto-fill otherwise.' },
  ListItems:     { display: 'list',       description: 'Text list. showType adds a category label. Fixed cols when from= present.' },
  TrackList:     { display: 'track-list', description: 'Compact track listing. Always single column.' },
  Grid:          { display: 'cards',      description: 'Generic auto-fill grid.' },
} as const

type HintName = keyof typeof HINT_DEFINITIONS
type DisplayType = 'cards' | 'list' | 'track-list'

const KNOWN_HINTS = new Set(Object.keys(HINT_DEFINITIONS) as HintName[])

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Hint = { name: string; params: Record<string, string> }

function parse(raw: string): Hint {
  const separatorIndex = raw.indexOf('?')
  const name = separatorIndex === -1 ? raw : raw.slice(0, separatorIndex)
  const params: Record<string, string> = {}
  if (separatorIndex !== -1) new URLSearchParams(raw.slice(separatorIndex + 1)).forEach((value, key) => { params[key] = value })
  return { name, params }
}

function getRows(hints: Hint[]): number | undefined {
  for (const hint of hints) {
    const rawValue = hint.params.rows ?? hint.params.initialRows
    if (rawValue !== undefined) {
      const parsed = Number(rawValue)
      if (!Number.isNaN(parsed)) return parsed
    }
  }
  return undefined
}

function getCols(hints: Hint[], name: string) {
  const colsByBreakpoint: { l?: number; m?: number; sm?: number; base?: number } = {}
  for (const hint of hints) {
    if (hint.name !== name) continue
    const colCount = Number(hint.params.cols)
    if (Number.isNaN(colCount)) continue
    if (hint.params.from === 'l') colsByBreakpoint.l = colCount
    else if (hint.params.from === 'm') colsByBreakpoint.m = colCount
    else if (hint.params.from === 'sm') colsByBreakpoint.sm = colCount
    else colsByBreakpoint.base = colCount
  }
  return colsByBreakpoint
}

// ---------------------------------------------------------------------------
// Output type
// ---------------------------------------------------------------------------

export type SectionItemsLayout = {
  /** Visual display type for L/M viewports. Drives which CSS class is applied. */
  display: DisplayType
  /** 'fixed' → repeat(var(--cols-*), 1fr). 'auto-fill' → browser decides column count. */
  colMode: 'fixed' | 'auto-fill'
  /** Only set in Pattern C: different display type for S/XS viewports. */
  smallDisplay?: DisplayType
  /** CSS custom properties: --cols-l, --cols-m, --cols-base, --rows, --rows-sm. */
  style?: CSSProperties
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

export function resolveSectionItemsLayout(
  components: string[] | null | undefined,
): SectionItemsLayout {
  if (!components?.length) return { display: 'cards', colMode: 'auto-fill' }

  const hints = components.map(parse).filter((hint) => KNOWN_HINTS.has(hint.name as HintName))
  const withFrom = hints.filter((hint) => hint.params.from !== undefined)
  const withoutFrom = hints.filter((hint) => hint.params.from === undefined)

  // ── Pattern B: no breakpoints ─────────────────────────────────────────────
  if (withFrom.length === 0) {
    const first = withoutFrom[0]
    if (!first) return { display: 'cards', colMode: 'auto-fill' }
    const rows = getRows(withoutFrom)
    const display = (HINT_DEFINITIONS[first.name as HintName]?.display ?? 'cards') as DisplayType
    return {
      display,
      colMode: 'auto-fill',
      style: rows !== undefined ? ({ '--rows': String(rows) } as CSSProperties) : undefined,
    }
  }

  // ── Patterns A & C: breakpoints present ───────────────────────────────────
  const largeName = withFrom[0].name
  const baseHint = withoutFrom[0]
  const isMixed = baseHint !== undefined && baseHint.name !== largeName

  const largeDisplay = (HINT_DEFINITIONS[largeName as HintName]?.display ?? 'cards') as DisplayType
  const smallDisplay = isMixed
    ? ((HINT_DEFINITIONS[baseHint.name as HintName]?.display ?? 'list') as DisplayType)
    : undefined

  // Include the no-breakpoint hint if it has the same name (Pattern A base fallback).
  const allLargeHints = hints.filter((h) => h.name === largeName)
  const largeCols = getCols(allLargeHints, largeName)
  const rows = getRows(withFrom)
  const colsL = largeCols.l ?? largeCols.m ?? 2
  const colsM = largeCols.m ?? largeCols.l ?? 2

  if (isMixed) {
    // Pattern C: different layout at S/XS
    const smallCols = getCols([baseHint], baseHint.name)
    const rowsSm = getRows([baseHint])
    return {
      display: largeDisplay,
      colMode: 'fixed',
      smallDisplay,
      style: {
        '--cols-l': String(colsL),
        '--cols-m': String(colsM),
        '--cols-base': String(smallCols.base ?? 1),
        ...(rows !== undefined ? { '--rows': String(rows) } : {}),
        ...(rowsSm !== undefined ? { '--rows-sm': String(rowsSm) } : {}),
      } as CSSProperties,
    }
  }

  // Pattern A: same layout, fixed cols per breakpoint
  const colsBase = largeCols.base ?? largeCols.sm ?? 2
  return {
    display: largeDisplay,
    colMode: 'fixed',
    style: {
      '--cols-l': String(colsL),
      '--cols-m': String(colsM),
      '--cols-base': String(colsBase),
      ...(rows !== undefined ? { '--rows': String(rows) } : {}),
    } as CSSProperties,
  }
}
