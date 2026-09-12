export const MAIN_SPORTS = ['football', 'badminton', 'tennis', 'f1', 'cricket', 'golf'];

export function splitSports<T extends { slug: string }>(children: T[]): { main: T[]; other: T[] } {
  return {
    main: children.filter((c) => MAIN_SPORTS.includes(c.slug)),
    other: children.filter((c) => !MAIN_SPORTS.includes(c.slug)),
  };
}