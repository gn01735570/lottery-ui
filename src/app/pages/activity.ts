export interface Activity {
  activityOid: string,
  name: string,
  year?: string,
  month?: string,
  day?: string,
  usersCount?: number,
  prizeCount?: number,
  info?: [{
    prizeId?: string,
    prize?: number,
    quota?: number,
    list?: number[],
  }],
  randomList?: string,
  currentIndex?: string,
}
