import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileDropComponent } from './file-drop.component';

describe('FileDropComponent', () => {
  let component: FileDropComponent;
  let fixture: ComponentFixture<FileDropComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
