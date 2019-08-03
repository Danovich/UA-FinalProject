import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-schedule-controls',
  styleUrls: ['schedule-controls.component.scss'],
  template: `
    <div class="controls">
      <button type="button" (click)="moveDate(offset - 1)">
        <img src="assets/chevron-left.svg">
      </button>
      <p>{{ selected | date:'fullDate' }}</p>
      <button type="button" (click)="moveDate(offset + 1)">
        <img src="assets/chevron-right.svg">
      </button>
    </div>
  `
})
export class ScheduleControlsComponent {
  @Input() selected: Date;
  @Output() move = new EventEmitter<number>();
  offset = 0;

  constructor() {}

  moveDate(offset: number) {
    this.offset = offset;
    this.move.emit(offset);
  }
}