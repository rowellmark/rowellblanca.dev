// Spotlight first, then featured (flagship) builds. Shared by the My Work
// server page and the client-side refresh in FlagshipSpotlight.
export function sortFlagship<T extends { spotlight?: boolean; featured?: boolean }>(projects: T[]): T[] {
  return [...projects].sort((a, b) => Number(!!b.spotlight) - Number(!!a.spotlight) || Number(!!b.featured) - Number(!!a.featured));
}
