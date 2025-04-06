import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicSlides, ModalController, IonButtons, IonIcon } from '@ionic/angular/standalone';
// import { UtilityService } from 'src/services/utility/utility.service';
import { Swiper, SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/element';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImageViewerComponent implements OnInit, AfterViewInit {
  @ViewChild('swiper', { static: false }) swiperEl: ElementRef<SwiperContainer> | undefined;

  @Input() type: string = 'base64';
  @Input() src: string | Array<string> | Array<any> = '';
  @Input() fileType: string = 'image';
  @Input() fileName: string = '';

  swiperOptions: SwiperOptions = {
    slidesPerView: 1,
    pagination: {
      el: 'swiper-pagination',
      clickable: true,
      bulletClass: 'swiper-pagination-bullet'
    },
    // zoom: {
    //   maxRatio: 5,
    //   minRatio: 1,
    //   toggle: true,
    // }
  }
  swiper?: Swiper;

  // swiperModules = [IonicSlides];

  constructor(
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    // private utility: UtilityService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log('image viewer will enter', this.swiperEl);
    this.swiperEl?.nativeElement.swiper.update();
    this.swiper = this.swiperEl?.nativeElement.swiper;
  }

  swiperReady(swiperContainer: SwiperContainer) {
    this.swiper = this.swiperEl?.nativeElement.swiper;
  }

  // downloadFile() {
  //   console.log('click download file ', );
  //   console.log(' check index ', this.swiper, this.swiper.activeIndex)
  //   if (this.src.constructor.name === 'Array') {
  //     if (this.swiper) {
  //       if (this.src[this.swiper.activeIndex].img) {
  //         this.download(this.src[this.swiper.activeIndex].img)
  //       } else {
  //         this.download(this.src[this.swiper.activeIndex]);
  //       }
  //     } else {
  //       this.utility.showToast('top', 'SOMETHING_WENT_WRONG', null, null, 'toast-failed');
  //     }
  //   } else {
  //     this.download(this.src, this.fileName);
  //   }
    
  // }

  // async download(data, fileName?) {
  //   let reg = new RegExp("^(http|https)://");
  //   if (reg.test(data)) {
  //     console.log('run download url file', fileName);
  //     this.utility.downloadFile(data, fileName ? fileName : '');
  //   } else {
  //     console.log('run download blob')
  //     await this.utility.showLoader();
  //     const response = await fetch(data);
  //     const blob = await response.blob();
  //     this.utility.saveBlobToDevice(blob, fileName ? fileName : '');
  //   }
  // }

  async confirm() {
    this.dismiss();
  }

  zoom(type: string) {
    let zoomNumber = this.swiper!.zoom.scale;
    if (type == 'in') {
      if (zoomNumber >= 3) {return;}
      zoomNumber++;
      this.swiper?.zoom.in(zoomNumber);
    } else {
      zoomNumber = zoomNumber > 1 ? zoomNumber - 1 : 1;
      this.swiper?.zoom.in(zoomNumber);
    }
  }

  dismiss(data: any = null) {
    this.modalCtrl.dismiss(data);
  }
}
