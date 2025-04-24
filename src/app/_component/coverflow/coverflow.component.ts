import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IonIcon, Platform } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { UtilityService } from 'src/services/utility/utility.service';
import { Swiper, SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-coverflow',
  templateUrl: './coverflow.component.html',
  styleUrls: ['./coverflow.component.scss'],
  standalone: true,
  imports: [IonIcon, TranslatePipe, NgClass, NgFor, NgIf, NgStyle],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoverflowComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('swiper') swiper!: ElementRef<any>;
  @Input() items: Array<any> = [];
  @Input() height: string = '450px';

  constructor(
    private plt: Platform,
    private utility: UtilityService
  ) { }

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (this.items.length > 1) {
      console.log('run on after view init ', this.swiper)
      this.initSwiper();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      if (this.items.length > 1) {
        console.log('run on changes ', this.swiper)
        setTimeout(() => {
          this.initSwiper();
        })
      }
    }
  }

  async initSwiper() {
    // swiper parameters
    console.log('before object assign swiper ', this.swiper)
    const swiperParams: SwiperOptions = {
      slidesPerView: 1.4,
      loop: true,
      autoplay: {
        delay: 1,
        disableOnInteraction: false
      },
      allowTouchMove: false,
      effect: 'coverflow',
      autoHeight: true,
      speed: 5000,
      spaceBetween: 5,
      centeredSlides: true,
      coverflowEffect: {
        depth: 200,
        slideShadows: false,
        stretch: 0,
        modifier: 1,
        rotate: 0
      }
    };
    Object.assign(this.swiper?.nativeElement, swiperParams);
    console.log('after object assign swiper ', this.swiper, this.swiper.nativeElement.autoplay)
    await this.swiper.nativeElement.initialize();
    setTimeout(() => {
      console.log('check swiper ', this.swiper.nativeElement.swiper.autoplay)
      ;
      this.swiper.nativeElement.swiper.autoplay.start();
    }, 100)
  }

  duplicateArray() {
    this.items = this.items.concat(this.items);
  }
  
}
