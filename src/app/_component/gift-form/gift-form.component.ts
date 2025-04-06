import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FileDropComponent } from '../file-drop/file-drop.component';
import { IonTextarea } from '@ionic/angular/standalone';
import { UtilityService } from 'src/services/utility/utility.service';
import global from 'src/config/global';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/services/data/data.service';
import { NgIf } from '@angular/common';
import { WeddingGift } from 'src/app/_model/data';

@Component({
  selector: 'app-gift-form',
  templateUrl: './gift-form.component.html',
  styleUrls: ['./gift-form.component.scss'],
  standalone: true,
  imports: [FileDropComponent, IonTextarea, ReactiveFormsModule, NgIf]
})
export class GiftFormComponent  implements OnInit, OnChanges {
  @Input() bank: string = '';
  @Input() userId: string | null = '';
  @Input() name: string | null = '';

  file: string = '';
  endpointAPI = global.endpoint_url + global.api_version + '/gift/submit-wedding-gift';
  formGroups!: FormGroup;

  constructor(
    private utility: UtilityService,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    this.formGroups = new FormGroup({
      bank_recipient: new FormControl(this.bank),
      name: new FormControl(),
      user_id: new FormControl(),
      account_name: new FormControl(),
      amount: new FormControl(),
      receipt_proof: new FormControl(),
      notes: new FormControl()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['name']) {
      this.patchForm('name', this.name);
    }
    if (changes && changes['userId']) {
      this.patchForm('user_id', this.userId);
    }

    if (changes && changes['bank']) {
      this.patchForm('bank_recipient', this.bank);
    }
  }

  async onDropFile(event: any) {
    console.log('drop file ', event)
    if (!event) {
      return;
    }
    const result: Array<File> = event;
    if (result[0].type === 'image/png' || result[0].type === 'image/jpg' || result[0].type === 'image/jpeg' || result[0].type === 'application/pdf') {
      let base64Data: any = await this.utility.toBase64(result[0]);
      this.file = base64Data;
    }
  }

  submitForm(event: any) {
    event.preventDefault(); 
    const body: WeddingGift = this.formGroups.getRawValue();
    console.log('submit form ', body, this.bank);
    body['receipt_proof'] = this.file;
    this.dataServ.submitGift(body).then((res) => {
      console.log('result submit gift ', res);
      this.file = '';
      this.formGroups.patchValue({account_name: '', amount: undefined, receipt_proof: undefined, notes: ''})
      this.utility.showToast('top', res.message, undefined, undefined, 'toast-success');
    }).catch((err) => {
      console.log('err submit gift ', err);
      this.utility.showToast('top', this.utility.getErrorAPI(err, 'Something went wrong, please try again later!'), undefined, undefined, 'toast-failed');
    });
  }

  getValue(variable: string) {
    return this.formGroups.value[variable];
  }

  patchForm(key: string, value: any) {
    if (this.formGroups) {
      this.formGroups.patchValue({[key]: value});
    }
  }
}
