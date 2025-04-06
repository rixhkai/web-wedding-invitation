import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { User, WeddingGift, rsvp } from 'src/app/_model/data';
import global from 'src/config/global';
import { UtilityService } from '../utility/utility.service';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public users: User[] = [];

  constructor(
    private http: HttpClient,
    private utility: UtilityService
  ) { }

  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find((user: User) => {
      if (user.id == id) {
        return true;
      } else {
        return;
      }
    });
  }

  getUsersList(data?: {q?: string, sort?: string, page?: number}): Observable<any> {
    let body = this.utility.formData(data, true);
    return this.http.get(global.endpoint_url + global.api_version+'/user?' + body).pipe(
      tap((res: any) => {
        if (res.status == 200) {
          if (!data || !data.page || data.page == 1) {
            this.users = res.data;
          } else {
            this.users = this.users.concat(res.data);
          }
        }
      }),
      map(res => res)
    );
  }

  getUsersDetail(id: string): Observable<any> {
    return this.http.get(global.endpoint_url + global.api_version+'/user/' + id).pipe(
      map(res => res)
    );
  }

  getRSVPDetail(id: string): Observable<any> {
    return this.http.get(global.endpoint_url + global.api_version+'/rsvp/user/' + id).pipe(
      map(res => res)
    );
  }

  readFile(data: {folder: string, fileName: string}): Observable<any> {
    console.log('global endpoint ', global.endpoint_url)
    let body = this.utility.formData(data, true);
    return this.http.get(global.endpoint_url + global.api_version+'/r2/read-file?' + body).pipe(
      map(res => res)
    );
  }

  async submitGift(data: WeddingGift): Promise<any> {
    const formData = new FormData();

    const response = await fetch(data.receipt_proof as string);
    const blob = await response.blob();
    const fileName = new Date().getTime() + '.png';
    formData.append(`receipt_proof`, blob, fileName);

    for (let [key, value] of Object.entries(data)) {
      if (key !== 'receipt_proof') {
        formData.append(key, value as any);
      }
    }
    return this.utility.uploadData(formData, '/gift/submit-wedding-gift');
  }

  submitRSVP(data: rsvp): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
    };
    const path = global.endpoint_url + global.api_version+'/rsvp/submit-rsvp';
    let body = this.utility.formData(data, true);
    return this.http.post(path, body, httpOptions).pipe(
      map(res => res)
    );
  }

  // createusers(id: string, data: UserRequest): Observable<any> {
  //   const baseUrl = global.endpoint_url + global.api_version+'/users/';
  //   const path = id ?  baseUrl + id + '/update' :  baseUrl + '/store';
  //   return this.http.post(path, data).pipe(
  //     map(res => res)
  //   );
  // }
}
