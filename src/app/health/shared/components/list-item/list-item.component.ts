import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-list-item',
  styleUrls: ['list-item.component.scss'],
  template: `
    <div class="list-item">
      <a [routerLink]="getRoute(item)">
        <p class="list-item__name">{{ item.name }}</p>
        <p class="list-item__ingredients"><span *ngIf="item.ingredients; else showWorkout">{{ item.ingredients | join }}</span></p>
        <ng-template #showWorkout>
          <span>{{ item | workout }}</span>
        </ng-template>
      </a>
      <div class="list-item__delete" *ngIf="toggled">
        <p>Delete item?</p>
        <button class="confirm" type="button" (click)="removeItem()">Yes</button>
        <button class="cancel" type="button" (click)="toggle()">No</button>
      </div>
      <button class="trash" type="button" (click)="toggle()">
        <img src="/assets/remove.svg">
      </button>
    </div>
  `
})
export class ListItemComponent {
  @Input() item: any;
  @Output() remove = new EventEmitter<any>();
  toggled = false;

  constructor() {}

  removeItem() {
    this.remove.emit(this.item);
  }

  toggle() {
    this.toggled = !this.toggled;
  }

  getRoute(item) {
    return [`../${item.ingredients ? 'meals' : 'workouts'}`, item.$key];
  }

}