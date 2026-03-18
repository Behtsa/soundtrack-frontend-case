/**
 * Casts the provided object (which is expected to be a discriminated union)
 * into a merged type with all possible fields from each distinct union type
 * using {@link UnionMerge}.
 *
 * @group Typescript
 * @example
 * ```ts
 * const source: { __typename: 'A', a: string } | { __typename: 'B', b: string } = ...
 * const union = unionMerge(source)
 * const value = union.a || union.b
 * ```
 */
export function unionMerge<T extends object>(input: T): UnionMerge<T> {
  return input as any
}

/**
 * Merges a discriminated union into a single type with all possible fields.
 * Fields not present in all types are made optional.
 *
 * Use {@link unionMerge} to easily apply this type cast.
 *
 * @group Typescript
 * @example
 * ```ts
 * type A = { __typename: 'A', a: string }
 * type B = { __typename: 'B', b: string }
 * type Merged = UnionMerge<A | B>
 * // => { __typename: 'A' | 'B', a?: string, b?: string }
 * ```
 */
export type UnionMerge<T extends object> = {
  [k in keyof T]: PickTypeOf<T, k>
} & {
  [k in NonCommonKeys<T>]?: PickTypeOf<T, k>
}

type PickTypeOf<T, K extends string | number | symbol> =
  K extends AllKeys<T> ? PickType<T, K> : never
type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any }
  ? T[K]
  : undefined
type Subtract<A, C> = A extends C ? never : A
type NonCommonKeys<T extends object> = Subtract<AllKeys<T>, keyof T>
type AllKeys<T> = T extends any ? keyof T : never
