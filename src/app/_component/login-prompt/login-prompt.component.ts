import { NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonModal, IonIcon, IonRippleEffect, IonButton } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/services/data/data.service';
import { EventsService } from 'src/services/events/events.service';

@Component({
  selector: 'app-login-prompt',
  templateUrl: './login-prompt.component.html',
  styleUrls: ['./login-prompt.component.scss'],
  standalone: true,
  imports: [NgIf, IonModal, IonIcon, IonRippleEffect, TranslatePipe, IonButton]
})
export class LoginPromptComponent  implements OnInit {
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  isModalLoginOpen = false;

  evSubscription: Subscription;
  constructor(
    private data: DataService,
    private events: EventsService
  ) {
    this.evSubscription = events.subscribe('authStateChange', (data: any) => {
      console.log('[login] result auth state change', data)
      this.onChange.emit({isLogin: data.user ? true : false})
    })
  }

  ngOnInit() {}

  doLogin(type: string) {
    this.data.loginSocmed(type as any).then((res) => {
      console.log('login socmed', res);
      this.isModalLoginOpen = false;
      // this.onChange.emit({isLogin: true});
    }).catch(err => {
      console.log('err login', err);
    })
  }

  getAuth() {
    return this.data.account;
  }

  onModalAction(type: string) {
    if (type == 'dismiss') {
      this.isModalLoginOpen = false;
    }
  }

  async logout() {
    await this.data.logout();
  }
}
