import { Injectable, NgZone } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { ModalController, Platform, LoadingController, ToastController } from '@ionic/angular/standalone';
import { ImageViewerComponent } from 'src/app/_component/image-viewer/image-viewer.component';
import global from 'src/config/global';
import { NetworkService } from '../network/network.service';
import { finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  public isCreatingLoader: boolean = false;
  public isCreatingToast: boolean = false;
  public toastAnchor: string = '';

  constructor(
    private modalCtrl: ModalController,
    private plt: Platform,
    private zone: NgZone,
    private network: NetworkService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private translate: TranslateService
  ) { }

  async presentImage(url: any, fileName?: string, fileType = 'image', color: string = "#008137", text: string = 'light') {
    console.log(url, 'ims')
    const modal = await this.modalCtrl.create({
      component: ImageViewerComponent,
      componentProps: {
        src: url.el ? url.el.src : url.src ? url.src : url,
        fileType,
        fileName
      },
      cssClass: 'image-viewer-modal',
      keyboardClose: true,
      showBackdrop: true
    })
    return await modal.present();
    
  }

  // Convert object into URL
  formData(data: any, cleanup?: boolean, cleanupZero?: boolean){
    let thisObj = this;
    const newData = data
    if (cleanup) {
      console.log('cleanup');
      for (let [key, value] of Object.entries(newData)) {
        console.log('cleanup key', key, value);
        if ((!cleanupZero && value != 0 && (!value || typeof value === 'undefined')) || (cleanupZero && (!value || typeof value === 'undefined'))) {
          delete newData[key];
        }
      }
    }
    return Object.keys(newData).map(function(key){
      if(Array.isArray(newData[key])) {
        return encodeURIComponent(key)+'='+encodeURIComponent(newData[key] as any);
      } else {
        return encodeURIComponent(key)+'='+encodeURIComponent(newData[key]);
      }
    }).join('&');
  }

  async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid')) {
      console.log('read as hybrid');
      const file = await Filesystem.readFile({
          path: photo.path!
      });
      console.log('return as hybrid', file);

      return 'data:image/jpeg;base64,' + file.data;
    } else {
      console.log('read as web');
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      console.log('return as web', response);

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  // Helper function
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    console.log('convert blob to base64: ', blob);
    this.zone.run(() => {
      const reader = new FileReader();
      console.log('inside zone: convert blob to base64: ', reader);
      reader.onerror = reject;
      reader.onload = () => {
          resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    })
  });

  dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
  }

  toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  async uploadData(formData: FormData, apiPath: string) {
    const url = global.endpoint_url + global.api_version + apiPath;

    return new Promise((resolve, reject) => {
      if (this.network.isOnline()) {
        this.http.post(url, formData)
        .pipe(
            finalize(() => {
              this.dismissLoader();
            })
        )
        .subscribe({
          next: (res) => {
            console.log('check res', res);
            resolve(res);
          },
          error: err => {
            reject(err);
          }
        });
      } else {
        this.network.toastNetworkOffline();
        reject("No internet connection");
      }
      
    });
    
  }

  public dismissLoader() {
    setTimeout(async () => {
      if(await this.loadingCtrl.getTop()) {
        this.loadingCtrl.dismiss();
      } else {
        setTimeout(async () => {
          this.loadingCtrl.dismiss();
        }, 500);
      }
    }, 500);
  }

  async showLoader(noTimeout: number = 0, text?: string) {
    let message = 'Memproses...';
    let cssClass = '';

    if(text){
      if(text = '-'){
        message = '';
        cssClass = 'calendar-loader';
      }else{
        message = text;
      }
    }
    if(!this.isCreatingLoader) {
      this.isCreatingLoader = true;

      let topLoading = await this.loadingCtrl.getTop();
      if(!topLoading) {
        let duration = 3000;
        if(noTimeout == 0) {
          duration = 3000;
        } else if(noTimeout == 1) {
          duration = 0;
        } else {
          duration = noTimeout;
        }

        let loading = await this.loadingCtrl.create({
            message: message,
            duration: duration,
            cssClass: cssClass,
            spinner: "lines"
        });
        this.isCreatingLoader = false;

        return await loading.present();
      } else {
        this.isCreatingLoader = false;
      }
    }
  }

  async showToast(position: "top" | "bottom" | "middle", msg: string, duration?: number, buttons?: Array<any>, cssClass?: string, anchor?: any) {
    let toastDuration = duration || duration == 0 ? duration : 3000;
    if (buttons && Array.isArray(buttons)) {
      for (let item of buttons) {
        item.text = this.translate.instant(item.text);
      }
    }
    if(!this.isCreatingToast) {
      this.translate.get([msg]).subscribe( async value => {
      this.isCreatingToast = true;

      let topToast = await this.toastCtrl.getTop();
      if(!topToast) {
          let errorMessage = '';
          try {
            let newMessage = value[msg];
            if(newMessage) {
              errorMessage = newMessage;
            } else {
              errorMessage = msg;
            }
          } catch(error) {
            errorMessage = msg;
          }

          let posAnchor = anchor ? anchor : (this.toastAnchor ? this.toastAnchor : undefined);

          console.log('check anchor' , posAnchor)

          let toast = await this.toastCtrl.create({
              message: errorMessage,
              duration: toastDuration,
              position: position,
              buttons: buttons,
              icon: cssClass === 'toast-failed' ?  'close-circle' : cssClass === 'toast-success' ? 'checkmark-circle' : undefined,
              cssClass,
              positionAnchor: posAnchor
          });
          this.isCreatingToast = false;

          return await toast.present();
      } else {
        this.isCreatingToast = false;
      }
    });
    }
  }

  getErrorAPI(err: any, message: string) {
    if (err.status !== 0) {
      const errMsg = err.error && (err.error.message || err.error.errors) ? (err.error.errors ?? err.error.message) : (err.errors ?? err.message ?? message);
      return errMsg;
    } else {
      return message;
    }
  }
}
