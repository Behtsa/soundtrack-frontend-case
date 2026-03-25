import styles from './SectionsSkeleton.module.css'

const SECTION_COUNT = 3
const CARD_COUNT = 6

export function SectionsSkeleton() {
  return (
    <>
      {Array.from({ length: SECTION_COUNT }).map((_, sectionIndex) => (
        <section key={sectionIndex} className={styles.section}>
          <div className={`${styles.titleBar} ${styles.shimmer}`} />
          <ul className={styles.skeletonAuto}>
            {Array.from({ length: CARD_COUNT }).map((_, cardIndex) => (
              <li key={cardIndex} className={`${styles.card} ${styles.shimmer}`} />
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
