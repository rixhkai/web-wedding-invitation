import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { DataService } from 'src/services/data/data.service';
import { UtilityService } from 'src/services/utility/utility.service';

@Component({
  selector: 'app-rsvp-form',
  templateUrl: './rsvp-form.component.html',
  styleUrls: ['./rsvp-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonButton, IonIcon, NgClass, NgIf, IonSpinner]
})
export class RsvpFormComponent  implements OnInit, OnChanges {
  @Input() userId: string | null = '';
  @Input() name: string | null = '';
  formGroups!: FormGroup;

  maxAttendance = 3;
  EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isSubmit = false;
  constructor(
    private utility: UtilityService,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    this.formGroups = new FormGroup({
      name: new FormControl(this.name),
      user_id: new FormControl(this.userId),
      email: new FormControl(),
      phone: new FormControl(),
      is_attend: new FormControl(undefined),
      attendance: new FormControl(1),
      relation: new FormControl()
    })
    console.log('check form group oninit', this.formGroups?.value)
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['name']) {
      this.patchForm('name', this.name);
      
      console.log('check form group ', this.formGroups?.value)
    }
    if (changes && changes['userId']) {
      this.patchForm('user_id', this.userId);
      this.initFirst();
    }
  }

  initFirst() {
    if (!this.userId) {return;}
    this.dataServ.getRSVPDetail(this.userId).subscribe({
      next: (res: any) => {
        console.log('res rsvp user ', res);
        if (res.data) {
          res.data['is_attend'] = res.data['is_attend'] ? 'yes' : 'no';
          this.formGroups.patchValue(res.data);
        }
      },
      error: (err: any) => {
        console.log('err rsvp user ', err);
      }
    })
  }

  async submitForm(event: any) {
    event.preventDefault();
    const body = this.formGroups.getRawValue();
    if (body.email && !this.EMAIL_REGEXP.test(body.email)) {
      this.utility.showToast('top', 'Email Invalid', undefined, undefined, 'toast-failed');
      return;
    }
    body['is_attend'] = body['is_attend'] == 'yes' ? true : false;
    console.log('check body ', body, this.userId, this.name, this.formGroups.value)
    // return;
    if (this.isSubmit) {
      return;
    }
    this.isSubmit = true;
    this.dataServ.submitRSVP(body).subscribe({
      next: (res: any) => {
        this.isSubmit = false;
        this.utility.showToast('top', res.message, undefined, undefined, 'toast-success');
      },
      error: (error: any) => {
        console.log('err ', error)
        this.isSubmit = false;
        this.utility.showToast('top', this.utility.getErrorAPI(error, 'Something went wrong, please try again later!'), undefined, undefined, 'toast-failed');
      }
    })
    
    console.log('submit form ', body, this.formGroups.valid);
  }

  changeAttendance(type: string) {
    const currentValue = this.formGroups.value['attendance'];
    if (type == 'add') {
      this.formGroups.patchValue({attendance: currentValue + 1})
    } else if (type == 'min') {
      this.formGroups.patchValue({attendance: currentValue - 1})
    }
  }

  changeAttend(isAttend: string) {
    this.formGroups.patchValue({is_attend: isAttend});
  }

  patchForm(key: string, value: any) {
    if (this.formGroups) {
      this.formGroups.patchValue({[key]: value});
      if (this.userId && this.name) {
        this.formGroups.get('name')?.disable();
      }
    }
  }

  getValue(variable: string) {
    return this.formGroups.value[variable];
  }
}
