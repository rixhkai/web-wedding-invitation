import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from 'src/app/_model/data';
import { DataService } from 'src/services/data/data.service';
import { EventsService } from 'src/services/events/events.service';
import { UtilityService } from 'src/services/utility/utility.service';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [FormsModule, IonButton]
})
export class UserFormComponent  implements OnInit, OnChanges {
  @Output() onCreated: EventEmitter<any> = new EventEmitter<any>();
  @Input() user: User | null = null;

  id: string = '';
  name: string = '';
  email: string = '';
  phone: string = '';
  constructor(
    private data: DataService,
    private events: EventsService,
    private utility: UtilityService
  ) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['user']) {
      const user = changes['user'].currentValue;
      this.id = '';
      if (user.id) {
        this.id = user.id;
      }
      this.name = user.name ?? '';
      this.email = user.email ?? '';
      this.phone = user.name ?? '';
    }
  }

  submit() {
    const body = {
      name: this.name,
      email: this.email,
      phone: this.phone
    }
    this.data.createUsers(this.id, body).then(
      (res) => {
        console.log('res create users ', res)
        this.onCreated.emit('created');
        this.utility.showToast('top', res.message, undefined, undefined, 'toast-success');
        if (res.data) {
          this.events.publish('users:edit', res.data);
          if (res.data.id) {
            this.id = res.data.id;
          }
        }
      },
      (err) => {
        console.log('res create users ', err)
        this.utility.showToast('top', this.utility.getErrorAPI(err, 'Something went wrong, please try again later!'), undefined, undefined, 'toast-failed');
      }
    )
  }
}
