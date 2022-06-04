import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from './pages/activity';

@Injectable({
  providedIn: 'root'
})
export class LotteryServiceService {

  constructor(private http: HttpClient) { }

  getActivity(req: Activity): Observable<Activity> {
    const url = `http://localhost:8080/api/v1/lotterys/activity?name=${req.name}&year=${req.year}&month=${req.month}&day=${req.day}`;
    return this.http.get<Activity>(url);
  }

  draw(usersList:number[], quota: number): number[] {
    return [];
  }

  save() {

  }
}
