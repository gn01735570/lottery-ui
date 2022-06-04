export interface Activity {
  oid ?: string,
  name: string,
  year: string,
  month: string,
  day: string,
  usersCount?: number,
  prizeCount?: number,
  info?: [{
    prize?: string,
    quota?: number,
    list?: number[],
  }]
}
