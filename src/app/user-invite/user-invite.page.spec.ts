import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInvitePage } from './user-invite.page';

describe('UserInvitePage', () => {
  let component: UserInvitePage;
  let fixture: ComponentFixture<UserInvitePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInvitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
