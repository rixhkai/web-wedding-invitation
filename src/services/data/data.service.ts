import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { R2Files, User, UserRequest, WeddingGift, rsvp } from 'src/app/_model/data';
import global from 'src/config/global';
import { UtilityService } from '../utility/utility.service';
import { folder } from 'ionicons/icons';
import { EventsService } from '../events/events.service';
import { Capacitor } from '@capacitor/core';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { FirebaseAuthentication, Persistence } from '@capacitor-firebase/authentication';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public users: User[] = [];
  public files: R2Files[] = [];

  isAuthenticated: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  account: any = null;

  constructor(
    private http: HttpClient,
    private utility: UtilityService,
    private events: EventsService
  ) {
    this.events.subscribe('users:edit', (data: User) => {
      if (data.id) {
        if (this.users.length == 0) {
          this.users.push(data);
        } else {
          for (let item of this.users) {
            if (item.id == data.id) {
              Object.assign(item, data);
              return;
            }
          }
          this.users.push(data);
        }
      }
    })
    this.events.subscribe('users:delete', (id: string) => {
      if (id) {
        let ind = 0;
        for (let item of this.users) {
          if (item.id == id) {
            this.users.splice(ind, 1);
            return;
          }
        }
        ind++;
      }
    })
    FirebaseAuthentication.getCurrentUser().then((user) => {
      console.log('check user ', user)
      this.account = user.user;
    });
  }

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

  async getAuth() {
    const auth = getAuth();
    const user = await FirebaseAuthentication.getCurrentUser();
    console.log('result firebase usedr ', user, auth)
    const idToken = user.user ? (await FirebaseAuthentication.getIdToken()).token : '';
    console.log('result id token ', idToken)
    const httpOptions  = {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + idToken})
    };
    return httpOptions;
  }

  initFirebase() {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyDbZ_hWQw79h5wB_Ig4kLpX5VNvERDHeZE",
      authDomain: "wedding-invitation-182f7.firebaseapp.com",
      projectId: "wedding-invitation-182f7",
      storageBucket: "wedding-invitation-182f7.firebasestorage.app",
      messagingSenderId: "335613158847",
      appId: "1:335613158847:web:65c1bf1005341e5d6fad0a",
      measurementId: "G-JSXP95QYT5"
    };

    if (Capacitor.isNativePlatform()) {
      const app = initializeApp(firebaseConfig);
	    // require to work appropriately on native devices
	    // initializeAuth(app, {
	    // 	persistence: indexedDBLocalPersistence
	    // });
      return app;
    } else {
      const app = initializeApp(firebaseConfig);
      FirebaseAuthentication.addListener('authStateChange', result => {
        this.events.publish('authStateChange', result);
        console.log('auth result ', result)
        if (result.user) {
          this.isAuthenticated.next(true);
          this.account = result.user;
        }
      });
      return app;
    }
  }

  async loginSocmed(type: 'apple' | 'google') {
    const data = await this.signInWithGoogle();
    if (data.user) {
      this.isAuthenticated.next(true);
      this.account = data.user;
    }
    return data;
  };

  signInWithGoogle = async () => {
    const result = await FirebaseAuthentication.signInWithGoogle();
    return result;
  };

  async logout() {
    await FirebaseAuthentication.signOut();
    this.isAuthenticated.next(false);
    this.account = null;
    return true;
  }

  async getUsersList(data?: {q?: string, sort?: string, page?: number}): Promise<any> {
    let body = this.utility.formData(data, true);
    console.log('start get user list');
    const httpOptions = await this.getAuth();
    console.log('http options', httpOptions)
    return new Promise<void>(async (resolve, reject) => {
      this.http.get(global.endpoint_url + global.api_version+'/user?' + body, httpOptions).pipe(
        tap((res: any) => {
          if (!data || !data.page || data.page == 1) {
            this.users = res.data;
          } else {
            this.users = this.users.concat(res.data);
          }
        }),
        map(res => res)
      ).subscribe({
        next: (res) => {resolve(res)},
        error: (err) => {
          console.log('err getuser ', err)
          reject(err)
        }
      });
    })
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
    const key = `${data.folder}/${data.fileName}`;
    if (this.files.length != 0) {
      let ind = 0;
      for (let item of this.files) {
        if (item.key == key) {
          return of({url: item.url});
        }
        ind++;
      }
    }
    let body = this.utility.formData(data, true);
    return this.http.get(global.endpoint_url + global.api_version+'/r2/read-file?' + body).pipe(
      tap((res: any) => {
        console.log('res read file ', res);
        const file = {key, url: res.url};
        if (this.files.length == 0) {
          this.files.push(file);
        } else {
          let ind = 0;
          for (let item of this.files) {
            if (item.key == file.key) {
              item.url = file.url;
            }

            else if (ind+1 == this.files.length) {
              this.files.push(file);
            }
            ind++;
          }
        }
      }),
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

  createUsers(id: string, data: UserRequest): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
      };
      const baseUrl = global.endpoint_url + global.api_version+'/user/';
      const path = id ?  baseUrl + 'update/' + id :  baseUrl + 'create-user';
      let body = this.utility.formData(data, true);
      const options = await this.getAuth();
      this.http.post(path, body, options).pipe(
        map(res => res)
      ).subscribe({
        next: (res) => {resolve(res)},
        error: (err) => {reject(err)}
      });
    })
    
  }

  deleteUsers(id: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const options = await this.getAuth();
      const path = global.endpoint_url + global.api_version+'/user/delete/' + id;
      return this.http.delete(path, options).pipe(
        map(res => res)
      );  
    })
    
  }

  async importUser(file: File): Promise<any> {
    const formData = new FormData();

    const response = await fetch(await this.utility.toBase64(file) as string);
    const blob = await response.blob();
    const fileName = new Date().getTime() + '.png';
    formData.append(`file`, blob, fileName);
    const user = await FirebaseAuthentication.getCurrentUser();
    const idToken = user.user ? (await FirebaseAuthentication.getIdToken()).token : '';
    console.log('result id token ', idToken)
    const httpOptions  = {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + idToken})
    };
    return this.utility.uploadData(formData, '/user/import-user', httpOptions);
  }

  getCommentList(data: {page?: number, sort?: string, q?: string}): Observable<any> {
    const path = global.endpoint_url + global.api_version+'/comment?';
    let body = this.utility.formData(data, true);
    return this.http.get(path + body).pipe(
      map(res => res)
    );
  }

  createComment(data: {user_id?: string | null | undefined, comment: string}): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
    };
    const path = global.endpoint_url + global.api_version+'/comment/submit';
    let body = this.utility.formData(data, true);
    return this.http.post(path, body, httpOptions).pipe(
      map(res => res)
    );
  }
}
