import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-schedule-days',
  styleUrls: ['schedule-days.component.scss'],
  template: `
    <div class="days">
      <button type="button" class="day" *ngFor="let day of days; index as i" (click)="selectDay(i)">
        <span [class.active]="i === selected">{{ day }}</span>
      </button>
    </div>
  `
})
export class ScheduleDaysComponent {
  @Input() selected: number;
  @Output() select = new EventEmitter<number>();
  days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  constructor() {}

  selectDay(dayIndex: number) {
    this.select.emit(dayIndex);
  }
}