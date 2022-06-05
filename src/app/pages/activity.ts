export interface Activity {
  activityOid ?: string,
  name: string,
  year: string,
  month: string,
  day: string,
  usersCount?: number,
  prizeCount?: number,
  info?: [{
    prizeId?: string,
    prize?: string,
    quota?: number,
    list?: number[],
  }]
}
