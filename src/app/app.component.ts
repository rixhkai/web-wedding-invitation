
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp } from 'ionicons/icons';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import * as icons from 'ionicons/icons';
import { TranslateService } from '@ngx-translate/core';
import Aos from 'aos';
import { Autoplay, EffectCoverflow, EffectFade, FreeMode, Pagination } from 'swiper/modules';
import { DataService } from 'src/services/data/data.service';

// register Swiper custom elements
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet,
    NgIf
  ],
})
export class AppComponent {
  currentUrl: string = '';
  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private route: Router,
    private translate: TranslateService,
    private data: DataService
  ) {
    addIcons(icons);
    route.events.subscribe(event => {
      
      if (event instanceof NavigationStart) {
        console.log(event)
        this.currentUrl = event.url;
      }
    })
    this.translate.use('en');
    Aos.init({once: false, initClassName: 'aos-init'});
    // this.initSwiper();
    this.data.initFirebase();
  }

  initSwiper() {
    const swiperEl = document.querySelector('swiper-container');
    console.log('swiper el ', swiperEl)

    if (!swiperEl) {
      setTimeout(() => {
        this.initSwiper();
      }, 200)
      return;
    }

    const params = {
      modules: [Autoplay, EffectCoverflow, EffectFade, FreeMode, Pagination],
      // inject modules styles to shadow DOM
      injectStylesUrls: [
        'swiper/element/css/autoplay',
        'swiper/element/css/effect-coverflow',
        'swiper/element/css/effect-fade',
        'swiper/element/css/free-mode'
      ],
    };

    Object.assign(swiperEl, params);

    swiperEl.initialize();
  }
}
