import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';

import { User } from '../../auth/shared/services/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  styleUrls: ['app-header.component.scss'],
  template: `
    <div class="app-header">
      <div class="wrapper">
        <!-- <img src="/assets/logo.svg"> -->
        <div *ngIf="user?.authenticated" class="app-header__user-info">
          <span (click)="logoutUser()" title="Logout {{ user.email }}"></span>
        </div>
      </div>
    </div>
  `
})
export class AppHeaderComponent {
  @Input() user: User;
  @Output() logout = new EventEmitter<any>();

  constructor() {}

  logoutUser() {
    this.logout.emit();
  }
}