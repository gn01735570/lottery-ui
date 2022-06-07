import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from './pages/activity';

@Injectable({
  providedIn: 'root'
})
export class LotteryServiceService {
  //lotteryService = 'http://localhost:8080/api/v1';
  lotteryService = 'https://de20-61-230-75-173.jp.ngrok.io/api/v1';

  constructor(private http: HttpClient) { }

  getActivityList(): Observable<Activity[]> {
    const url = `${this.lotteryService}/lotterys/activity/list`;
    return this.http.get<Activity[]>(url);
  }

  getActivity(activityOid: string): Observable<Activity> {
    const url = `${this.lotteryService}/lotterys/activity?activityOid=${activityOid}`;
    return this.http.get<Activity>(url);
  }

  savePrizeEmpls(activityId: string, prizeId: string, emplsId:number[], quota: string): Observable<Activity> {
    const url = `${this.lotteryService}/prizeEmpls`;
    let emplsIdList = emplsId.toString();
    const prizeEmpls = {
      actyId: activityId,
      prizeId: prizeId,
      emplsId: emplsIdList,
      quota: quota,
    }
    console.log('url', url, 'prizeEmpls', prizeEmpls);
    return this.http.post<Activity>(url, prizeEmpls);
  }

  createActivity(name, usersConunt, prizeCount): Observable<Activity> {
    const url = `${this.lotteryService}/lotterys/activity`
    const req = {
      name:name,
      usersCount: usersConunt,
      prizeCount: prizeCount
    }
    return this.http.post<Activity>(url, req);
  }

  createPrizeInfo(activityId, prize, quota): Observable<any> {
    const url = `${this.lotteryService}/prizes`
    const req = {
      activityId: activityId,
      prize: prize,
      quota: quota
    }
    return this.http.post<any>(url, req);
  }
}
