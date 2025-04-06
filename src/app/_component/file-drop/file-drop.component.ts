import { NgClass } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { IonIcon, Platform } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { UtilityService } from 'src/services/utility/utility.service';

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
  standalone: true,
  imports: [IonIcon, TranslatePipe, NgClass]
})
export class FileDropComponent implements OnInit {
  private _isDragging: boolean = false;
  @Output() public selectedFiles = new EventEmitter<File[]>();

  constructor(
    private plt: Platform,
    private utility: UtilityService
  ) { }

  ngOnInit() {}

  public get isDragging(): boolean { return this._isDragging; }

  onDropFile(event: any): void {
    event.preventDefault();
    this._isDragging = false;
    console.log('check event', event);
    const result: Array<File> = [];

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (const item of event.dataTransfer.items) {
        console.log('check items', item);
        if (item.kind !== 'file') {
          return;
        }
        result.push(item.getAsFile());
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (const file of event.dataTransfer.files) {
        result.push(file);
      }
    }

    this.emitFiles(result);
  }

  private emitFiles(files: File[]): void {
    this.selectedFiles.emit(files);
  }

  chooseFile() {
    if (!this.plt.is('hybrid')) {
      this.takeFile(['image/jpg', 'image/jpeg', 'image/png']);
      return;
    }
    this.takePicture();
  }

  async takeFile(customTypes = ['application/pdf']) {
    const result = await FilePicker.pickFiles({
      types: customTypes,
      readData: false
    });
    const file = result.files[0];
    const data = new File([file.blob!], file.name, { type: file.mimeType })
    this.emitFiles([data]);
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      allowEditing: true,
      source: Capacitor.isNativePlatform() ?  CameraSource.Prompt : CameraSource.Photos,
      resultType: CameraResultType.Uri
    });
    const base64Data = await this.utility.readAsBase64(image);
    const fileName = new Date().getTime() + '.jpeg';
    const data = new File([this.utility.dataURItoBlob(base64Data)], fileName, { type: 'image/png' });
    this.emitFiles([data]);
  }

  dragEnter(event: any) {
    console.log('event drag enter', event);
    this._isDragging = true;
  }

  dragLeave(event: any) {
    console.log('event drag leave', event);
    this._isDragging = false;
  }

  allowDrop(event: any) {
    event.preventDefault();
  }
}
