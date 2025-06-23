import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonModal, IonSearchbar, ModalController, IonIcon } from '@ionic/angular/standalone';
import { DataService } from 'src/services/data/data.service';
import { User } from '../_model/data';
import { UtilityService } from 'src/services/utility/utility.service';
import { UserFormComponent } from '../_component/user-form/user-form.component';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { ConfirmationComponent } from '../_component/confirmation/confirmation.component';
import { EventsService } from 'src/services/events/events.service';
import { LoginPromptComponent } from '../_component/login-prompt/login-prompt.component';
import { Clipboard } from '@capacitor/clipboard';
import global from 'src/config/global';

@Component({
  selector: 'app-user-invite',
  templateUrl: './user-invite.page.html',
  styleUrls: ['./user-invite.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NgFor, IonButton, IonModal, IonSearchbar,
    UserFormComponent, LoginPromptComponent, NgIf, IonIcon
  ]
})
export class UserInvitePage implements OnInit {

  q: string = '';
  page: number = 0;
  totalPage: number = 0;
  user: User | null = null;

  modalOpen = false;
  errMsg = '';
  private data = inject(DataService);
  public utility = inject(UtilityService);
  private modalCtrl = inject(ModalController);
  private events = inject(EventsService);
  constructor(
  ) { }

  ngOnInit() {
    this.initUser();
  }

  initUser(type = 'init') {
    console.log('init user')
    if (type == 'init') {
      this.page = 1;
      this.totalPage = 1;
    }
    this.errMsg = '';
    this.data.getUsersList({q: this.q, page: this.page}).then(
      (res) => {
        this.errMsg = '';
        this.page++;
        this.totalPage = res.pagination.total_page;
        console.log('res get user list ', res)
      }
    ).catch((err) => {
      this.errMsg = err.status == 400 || err.status == 401 ? 'Unauthorized access' : this.utility.getErrorAPI(err, 'Something went wrong, please try again later!');
      console.log('err get user list ', err, this.errMsg)
    })
  }

  getUsers(): User[] {
    return this.data.getUsers();
  }

  editContact(data: User | null) {
    this.user = data;
    this.modalOpen= true;
  }

  copyLink(id: string) {
    Clipboard.write({
      url: global.endpointWeb + '?to=' + id
    }).then(() => {
      this.utility.showToast('top', 'Berhasil di salin ke clipboard', undefined, undefined, 'toast-success');
    }).catch(() => {
      this.utility.showToast('top', 'Gagal di salin ke clipboard', undefined, undefined, 'toast-failed');
    })
  }

  async deleteContact(data: User) {
    if (!data || !data.id) {return;}
    const modal = await this.modalCtrl.create({
      component: ConfirmationComponent,
      cssClass: 'inline-bot-confirm',
      componentProps: {
        header: 'Delete User',
        message: 'User yg sudah di hapus tidak bisa di batalkan',
        textConfirm: 'Delete',
      }
    })

    modal.onWillDismiss().then((res) => {
      console.log('on will dismiss ', res);
      if (res.data && res.data.type == 'confirmed') {
        this.data.deleteUsers(data.id).then(
          (res: any) => {
            console.log('res delete user ', res);
            this.events.publish('users:delete', data.id);
            this.utility.showToast('top', res.message, undefined, undefined, 'toast-success');
          },
          (err: any) => {
            console.log('err delete user ', err);
            this.utility.showToast('top', this.utility.getErrorAPI(err, 'Something went wrong, please try again later!'), undefined, undefined, 'toast-failed');
          }
        )
      }
    })
    modal.present();
  }

  async import(customTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']) {
    const result = await FilePicker.pickFiles({
      types: customTypes,
      readData: false
    });
    const file = result.files[0];
    const data = new File([file.blob!], file.name, { type: file.mimeType });
    this.data.importUser(data).then((res) => {
      console.log('res import user', res);
      this.initUser();
      this.utility.showToast('top', res.message, undefined, undefined, 'toast-success');
    }).catch(err => {
      console.log('err import user ', err);
      this.utility.showToast('top', this.utility.getErrorAPI(err, 'Something went wrong, please try again later!'), undefined, undefined, 'toast-failed');
    })
  }
}
