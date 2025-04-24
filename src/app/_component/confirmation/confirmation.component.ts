import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonModal, ModalController, IonButton } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  standalone: true,
  imports: [TranslatePipe, IonButton, NgIf]
})
export class ConfirmationComponent  implements OnInit {
  @Output() onConfirm: EventEmitter<any> = new EventEmitter<any>();

  @Input() modal: IonModal | null = null;
  @Input() header: string = '';
  @Input() message: string = '';
  @Input() img: string = '';
  @Input() textCancel: string = 'CANCEL';
  @Input() textConfirm: string = 'YES';

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log('data ', this.img)
  }

  handleConfirm() {
    console.log('handle confirm', this.modal)
    if (this.modal) {
      this.onConfirm.emit({type: 'confirmed'});
      this.modal.dismiss({type: 'confirmed'});
    } else {
      this.modalCtrl.dismiss({type: 'confirmed'});
    }
  }

  dismiss() {
    if (this.modal) {
      this.modal.dismiss();
    } else {
      this.modalCtrl.dismiss();
    }
  }
}
