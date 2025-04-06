import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core';
import { EventsService } from '../events/events.service';
import { TranslateService } from '@ngx-translate/core';

declare var navigator: { onLine: boolean; };

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  onDevice: boolean = false;
  disconnect: boolean = false;
  toasts: Array<any> = [];
  networkStatus: any;
  networkListener: PluginListenerHandle | undefined;

  constructor(
    public platform: Platform,
    public toastCtrl: ToastController,
    private events: EventsService,
    private translate: TranslateService
  ) {
    console.log('Hello NetworkProvider Provider');
    this.initAwait();
  }

  async initAwait() {
    this.networkListener = await Network.addListener('networkStatusChange', (status) => {
      this.networkStatus = status;
      console.log('Network status changed', status);
      if(this.networkStatus.connectionType === 'none') {
        this.events.publish('SHOW:OFFLINE', {offline: 'No Connection.'});
      } else {
        this.events.publish('SHOW:OFFLINE', {online: 'Connected.'});
      }
    });
  }

  isOnline = (): boolean => {
    if(this.networkStatus && this.networkStatus.connectionType) {
      return this.networkStatus.connectionType !== 'none';
    } else {
      return navigator.onLine;
    }
  };

  isOffline(): boolean {
    if(this.networkStatus && this.networkStatus.connectionType) {
      return this.networkStatus.connectionType === 'none';
    } else {
      return !navigator.onLine;
    }
  }

  async toastNetworkOffline() {
    let val: string = this.translate.instant('NO_INTERNET');
    let toast = await this.toastCtrl.create({
      message: val,
      duration: 3000,
      position: 'top'
    });
    this.toasts.push(toast);

    if(this.toasts.length == 1){
      toast.present();
    } else {
      this.toasts.pop();
    }

    toast.onDidDismiss().then(() => {
      console.log('Dismissed toast');
      this.toasts.pop();
    });
  }
}
