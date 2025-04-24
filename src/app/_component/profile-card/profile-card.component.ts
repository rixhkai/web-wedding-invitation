import { NgFor, NgStyle } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import global from 'src/config/global';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  standalone: true,
  imports: [NgFor, NgStyle],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileCardComponent  implements OnInit {

  imgPath: string = global.cdnPath + '/cover/profile/';
  imgJawa: string = global.cdnPath + '/cover/jawa/';
  brideName: string = 'Putri Aliffia Darmawan';
  brideDesc: string = 'Putri dari\n Alm Bapak Darmawan\n dan\n Ibu Rofiah';
  brideIg: string = '@putrialiffia_98';
  groomName: string = 'Rijal Abdullah';
  groomDesc: string = 'Putra dari\n Bapak Isrori Maktoridi\n dan\n Ibu Daswiati';
  groomIg: string = '@rijallad';
  groomImg: string = this.imgJawa + '9.jpg';
  brideImg: string = this.imgJawa + '8.jpg';
  logoGroom: string = this.imgPath + 'EG-Groom.png';
  logoBride: string = this.imgPath + 'EG-Bride.png';
  title: string = 'Putri & Rijal';

  constructor() { }

  ngOnInit() {}

  openLink(url: string, type: string = 'url') {
    let newUrl = url;
    if (type == 'ig') {
      newUrl = 'https://instagram.com/' + url;
    }
    window.open(newUrl, '_system');
  }
}
