import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { ScheduleService, ScheduleItem } from '../../../shared/services/schedule.service';
import { Workout, WorkoutsService } from '../../../shared/services/workouts.service';
import { Meal, MealsService } from '../../../shared/services/meals.service';
import { Store } from 'store';

@Component({
  selector: 'app-schedule',
  styleUrls: ['schedule.component.scss'],
  template: `
    <div class="schedule">
      <app-schedule-calendar
        [date]="date$ | async"
        [items]="schedule$ | async"
        (change)="changeDate($event)"
        (select)="changeSection($event)">
      </app-schedule-calendar>
      <app-schedule-assign *ngIf="openAssign"
        [section]="selected$ | async"
        [list]="list$ | async"
        (update)="assignItem($event)"
        (cancel)="closeAssign()">
      </app-schedule-assign>
    </div>
  `
})
export class ScheduleComponent implements OnInit, OnDestroy {
  openAssign = false;
  date$: Observable<Date>;
  schedule$: Observable<ScheduleItem[]>;
  selected$: Observable<any>;
  list$: Observable<Meal[] | Workout[]>;
  subscriptions: Subscription[] = [];

  constructor(
    private mealsService: MealsService,
    private workoutsService: WorkoutsService,
    private scheduleService: ScheduleService,
    private store: Store
  ) {}

  ngOnInit() {
    this.date$ = this.store.select('date');
    this.schedule$ = this.store.select('schedule');
    this.selected$ = this.store.select('selected');
    this.list$ = this.store.select('list');
    this.subscriptions = [
      this.scheduleService.schedule$.subscribe(),
      this.scheduleService.selected$.subscribe(),
      this.scheduleService.list$.subscribe(),
      this.scheduleService.items$.subscribe(),
      this.mealsService.meals$.subscribe(),
      this.workoutsService.workouts$.subscribe()
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  closeAssign() {
    this.openAssign = false;
  }

  assignItem(items: string[]) {
    console.log('assignItem:', items);

    this.scheduleService.updateItems(items);
    this.closeAssign();
  }

  changeDate(date: Date) {
    this.scheduleService.updateDate(date);
  }

  changeSection(event) {
    this.openAssign = true;
    this.scheduleService.selectSection(event);
  }
}