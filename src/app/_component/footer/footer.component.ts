import { Component, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonIcon]
})
export class FooterComponent  implements OnInit {

  title = 'Putri & Rijal';
  weddingDate: string = 'Mei 10';
  weddingYear: string = '2025';
  constructor() { }

  ngOnInit() {}

}
