import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonTextarea } from '@ionic/angular/standalone';
import AOS from 'aos';
import { SwiperContainer } from 'swiper/element';
import { Swiper } from 'swiper/types';
import { ImageViewerComponent } from '../_component/image-viewer/image-viewer.component';
import { UtilityService } from 'src/services/utility/utility.service';
import { App } from '@capacitor/app';
import { DisqusComponent } from '../disqus/disqus.component';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/services/data/data.service';
import { User } from '../_model/data';
import { FileDropComponent } from '../_component/file-drop/file-drop.component';
import { GiftFormComponent } from '../_component/gift-form/gift-form.component';
import { RsvpFormComponent } from '../_component/rsvp-form/rsvp-form.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NgFor, NgStyle, ImageViewerComponent, DisqusComponent, IonSelect, IonSelectOption,
    FileDropComponent, IonTextarea, GiftFormComponent, RsvpFormComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('swiperGallery', { static: true }) readonly swiperGallery?: ElementRef<SwiperContainer>
  @ViewChild('player') player: ElementRef<HTMLAudioElement> |undefined = undefined;

  imgPath: string = 'assets/img/cover/';
  // coverPane = [this.imgPath+'photo-city.avif', this.imgPath+'photo-coral-sea.avif', this.imgPath+'photo-jungle.avif', this.imgPath+'photo-sand-rock.avif', this.imgPath+'photo-sea-sunset.avif'];
  coverPane = [this.imgPath+'1.jpg', this.imgPath+'2.jpg', this.imgPath+'3.jpg', this.imgPath+'4.jpg', this.imgPath+'5.jpg', this.imgPath+'6.jpg', this.imgPath+'7.jpg', this.imgPath+'8.jpg', this.imgPath+'9.jpg'];

  id: string = '';
  title: string = 'Putri & Rijal';
  guestName: string = 'Kepada Yth\n Bapak/Ibu/Saudara/i';
  user: User | null = null;
  weddingDate: string = 'Mei 10th';
  weddingYear: string = '2025';
  weddingDayOfWeek: string = 'Mei';
  brideName: string = 'Putri Aliffia Darmawan';
  brideDesc: string = 'Putri dari Alm Bapak Darmawan dan Ibu Rofiah';
  brideIg: string = '@putrialiffia_98';
  groomName: string = 'Rijal Abdullah';
  groomDesc: string = 'Putra dari Bapak Isrori Maktoridi dan Ibu Daswiati';
  groomIg: string = '@rijallad';

  loremIpsum: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  galleryTitle: string = 'Terurai ';
  gallerySub: string = 'Terurai kisah dua sejoli\n Antara tuan dan nona yang saling mengikat janji\n di depan para saksi dan Tuhan yang membersamai\n Beriring doa dari semesta yang merestui';
  galleryPrimary: string = '';
  locationName = 'Aula SMKN 6 Jakarta';
  locationAddress = 'Jl. Prof. Joko Sutono SH No.1 2A, RT.1/RW.2, Melawai, Kebayoran Baru, South Jakarta City, Jakarta 12160';

  weddingGiftDesc = 'Your blessing and coming to our wedding are enough for us. However, if you want to give a gift we provide a Digital Envelope to make it easier for you. Thank You';

  mandiriAccountNumber = 'XXXXX';
  mandiriAccountName = 'Putri Aliffia Darmawan';
  bankAccount = 'mandiri';
  bankList = [{id: 'mandiri', name: 'Bank Mandiri \n ' + this.mandiriAccountNumber, bankAccount: 'Bank Mandiri (008)', accountNumber: this.mandiriAccountNumber, accountName: this.mandiriAccountName, img: ''}];
  journey = [
    {img: this.imgPath+'3.jpg', title: '21/09/2025', data: 'Awal kisah dua atma terbentuk. Kala itu, semesta memberikan satu hari yang begitu menggembirakan. Awal mula kata cinta terucap tanpa jeda. Saat itu juga, seorang pria dengan rasa takutnya, di atas perjalanan sebuah gondola menatap wajah pujaan hatinya. Uraian kata indah terucap dan sebuah permohonan asmara diutarakan. Hingga, senyuman indah penerimaan terbalaskan bersama hangatnya sinar mentari kala itu.'},
    {img: this.imgPath+'5.jpg', title: '27/11/2025', data: 'Di depan luasnya bentangan laut malam itu, pria itu memantapkan tujuannya. Ia membawa pujaan hatinya melalui banyak hal indah setiap detiknya. Memberi rangkaian bunga cantik di pagi hari, berwisata di aquarium besar yang diimpikan pujaan hati, berjalan kala rintik hujan di Pantai saat senja hari. Hingga tertawa bercanda di atas sebuah jembatan di depan laut nan elok kala itu. Saat itu, ia membuka cincin, menggenggam tangan dan menatap sang pujaan hati sembari berkata “maukah kamu menjadi istriku”. Deburan ombak halus serasa mendukung hingga lamaran itu terbalas dengan kata “iya, aku mau”.'}
  ]

  dayCount: number = 0;
  hourCount: number = 0;
  minutesCount: number = 0;
  secondsCount: number = 0;

  srcAudio = '';


  isMusicPaused: boolean = true;
  interval: any = null;
  scrollRef = 0;
  lastScrollTop = 0;
  constructor(
    private zone: NgZone,
    public utility: UtilityService,
    private route: ActivatedRoute,
    private dataServ: DataService
  ) {
    App.addListener('appStateChange', (state) => {
      if (state.isActive) {
        this.loadMusicBackground();
      } else {
        this.pauseMusic(true);
      }
    })
    route.params.subscribe((param: any) => {
      if (param && param.id) {
        this.id = param.id;
      }
    })
    window.addEventListener("dragover",(e: any) => {
      e = e || event;
      e.preventDefault();
    },false);
    window.addEventListener("drop",(e: any) => {
      e = e || event;
      e.preventDefault();
    },false);
  }

  ngOnInit() {
    this.initCountdown();
    console.log('player ', this.player)
    this.initFirst();
    let scrollRef = 0;

    window.addEventListener('scroll', function() {
      // increase value up to 10, then refresh AOS
      console.log('on scroll ', scrollRef);
      scrollRef <= 10 ? scrollRef++ : AOS.refresh();
    });
    // this.handlingAOS(false, undefined);
  }

  async handleScroll(event: any) {
    // console.log('on scroll ', event);
    // this.scrollRef <= 10 ? this.scrollRef++ : AOS.refresh();
    // console.log("on event scroll ", event, (this.element.nativeElement as Element).className, (this.element.nativeElement as Element).scrollHeight, (this.element.nativeElement as Element).getBoundingClientRect().top);
    var st = (event.target as Element).scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    // console.log('check scroll top ', st,)
    let threshold = 300;
    let clientHeight = (event.target as Element).clientHeight;
    // console.log('check client height ', clientHeight, st)
    if (st > this.lastScrollTop) {
       // downscroll code
      //  console.log('check on scroll bot');
      this.handlingAOS(false, clientHeight, 50, 'to-bot');
    } else if (st < this.lastScrollTop) {
       // upscroll code
      // console.log('check on scroll top', st, this.lastScrollTop, clientHeight);
      if (st < 10) {
        this.handlingAOS(true, clientHeight);
      } else {
        this.handlingAOS(true, clientHeight, 50, 'to-top');
      }
    }
    this.lastScrollTop = st;
  }

  isVisible(element: Element) {
    console.log('isvisible el ', element)
    return new Promise(resolve => {
      const observer = new IntersectionObserver(([entry]) => {
        resolve(entry.intersectionRatio === 1);
        observer.disconnect();
      });

      observer.observe(element);
    });
  }

  handlingAOS(isRemove: boolean = false, clientHeight: number | undefined, threshold = 50, scrollType: string | undefined = undefined) {
    let listEl = document.querySelectorAll('[data-aos]')
    const aosDistance = 100; // in px
    // console.log('check list el ', listEl);
    if (listEl && listEl.length != 0) {
      listEl.forEach(async (el: Element) => {
        const clientRect = el.getBoundingClientRect();
        // if (el.classList.contains('gift-card-bank-wrap')) {
        //   const isVisible = (clientRect.top - aosDistance) <= (clientHeight! - threshold);
        //   console.log('check el ', el.clientHeight, el.scrollHeight, el.getBoundingClientRect().top, isVisible, clientHeight, el.className);
        // }
        const isVisible = !clientHeight && typeof clientHeight == 'undefined' ? await this.isVisible(el) : (clientRect.top - aosDistance) <= (clientHeight! - threshold);
        if (isVisible) {
          const isInclude = el.classList.value.includes('aos-animate');
          if (isInclude) {return;}
          this.changeClassElement('add', el, 'aos-animate');
        } else if (!isRemove || (el.getBoundingClientRect().top >= 0 && (typeof scrollType == 'undefined' || scrollType == 'to-top'))) {
          // console.log('to remove ', clientRect.top, clientHeight, el.className, scrollType)
          this.changeClassElement('remove', el, 'aos-animate');
        }
      })
    }
  }

  changeClassElement(type: 'remove' | 'add' = 'add', el: Element, classname: string) {
    const timeout = el.getAttribute('data-timeout');
    if (timeout) {clearTimeout(+timeout);}

    el.setAttribute('data-timeout', setTimeout(() => {
      const classList = el.classList.value;
      const isInclude = classList.includes(classname);
      // console.log('see change class ', type, classList, isInclude);
      if (type == 'add' && !isInclude) {
        // console.log('add class  ', classname, el.className)
        el.classList.add(classname);
      } else if (type != 'add' && isInclude){
        el.classList.remove(classname);
      }
    }, 0) + '');
  }

  ngAfterViewInit(): void {
    const swiperParams = {
      breakpoints: {
        100: {
          slidesPerView: 3,
        },
        640: {
          slidesPerView: 5,
        },
        1024: {
          slidesPerView: 6,
        },
      },
      pagination: {
        type: 'progressbar'
      }
    };

    // now we need to assign all parameters to Swiper element
    Object.assign(this.swiperGallery?.nativeElement!, swiperParams);
    this.swiperGallery?.nativeElement.initialize();
    console.log('after view init player ', this.player)
    var video: any = document.getElementById("myVideo");
    video!.oncanplaythrough = function() {
        video!.muted = true;
        video.play();
    }
    this.player!.nativeElement.load();
    this.player!.nativeElement.onload = ((ev: any) => {
      console.log('log event ', ev);
      this.player?.nativeElement.play();
      this.isMusicPaused = this.player!.nativeElement.paused;
    })
    
  }

  initFirst() {
    this.dataServ.readFile({folder: 'audio', fileName: 'backsound.aac'}).subscribe({
      next: (res: any) => {
        const url = res.url;
        this.srcAudio = url;
        this.player!.nativeElement.load();
      }
    })
    this.initUser();
  }

  initUser() {
    if (!this.id) {return;}
    this.dataServ.getUsersDetail(this.id).subscribe({
      next: (res: any) => {
        const user: User = res.data;
        this.guestName = user.name;
        this.user = user;
      }
    })
  }

  handleSlide(event: any, type?: string) {
    console.log('event ', event, type)
    // this.swiperStory?.nativeElement.swiper.update()
    if (type == 'gallery') {
      console.log('check run type', type, (event.swiper as Swiper).activeIndex)
      this.zone.run(() => {
        this.galleryPrimary = this.coverPane[(event.swiper as Swiper).activeIndex];
      })
      console.log('check run type', type, this.galleryPrimary)
    }
    event.swiper.update()
  }

  handleSlideClick(event: any, type?: string) {
    console.log('event sclick', event, type)
    if (type == 'gallery' && event.target.localName == 'img') {
      this.galleryPrimary = event.target.currentSrc;
    }
  }

  initCountdown() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      const date = new Date();
      const endDate = new Date('2025-05-10T00:30:00.000Z');
      const _second = 1000;
      const _minute = _second * 60;
      const _hour = _minute * 60;
      const _day = _hour * 24;
      const distance = endDate.getTime() - date.getTime();
      if (distance < 0) {
        clearInterval(this.interval);
        this.resetCountdown();
        return;
      }
      this.dayCount = Math.floor(distance / _day);
      this.hourCount = Math.floor((distance % _day) / _hour);
      this.minutesCount = Math.floor((distance % _hour) / _minute);
      this.secondsCount = Math.floor((distance % _minute) / _second);
    }, 1000)
  }

  resetCountdown() {
    this.dayCount = 0;
    this.hourCount = 0;
    this.minutesCount = 0;
    this.secondsCount = 0;
  }

  loadMusicBackground() {
    this.isMusicPaused = this.player!.nativeElement.paused;
    if (this.player!.nativeElement.paused) {
      this.player!.nativeElement.play();
      this.isMusicPaused = false;
    }
  }

  pauseMusic(forcePaused: boolean = false) {
    console.log('pausing music')
    if (this.player?.nativeElement.paused && !forcePaused) {
      this.loadMusicBackground();
    } else {
      this.player!.nativeElement.pause();
      this.isMusicPaused = true;
    }
    
  }

  handleOnVisible(type: any) {
    console.log('visible t', type);
  }
}
