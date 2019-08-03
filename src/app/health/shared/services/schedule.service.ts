import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { Store } from 'store';
import { Meal } from './meals.service';
import { Workout } from './workouts.service';
import { AuthService } from '../../../auth/shared/services/auth.service';

export interface ScheduleItem {
  meals: Meal[],
  workouts: Workout[],
  section: string,
  timestamp: number,
  $key?: string
}

export interface ScheduleList {
  morning?: ScheduleItem,
  lunch?: ScheduleItem,
  evening?: ScheduleItem,
  snacks?: ScheduleItem,
  [key: string]: any
}

@Injectable()
export class ScheduleService {
  date$ = new BehaviorSubject(new Date());
  section$ = new Subject();
  itemList$ = new Subject();
  items$ = this.itemList$.pipe(
    withLatestFrom(this.section$),
    map(([items, section]: any[]) => {
      console.log(section.data);

      const id = section.data.$key;
      const defaults: ScheduleItem = {
        workouts: null,
        meals: null,
        section: section.section,
        timestamp: new Date(section.day).getTime()
      };
      const payload = {
        ...id ? section.data : defaults,
        ...items
      };
      if (id) {
        return this.updateSection(id, payload);
      } else {
        return this.createSection(payload);
      }
    })
  );
  selected$ = this.section$.pipe(
    tap((next: any) => this.store.set('selected', next))
  );
  list$ = this.section$.pipe(
    map((value: any) => this.store.value[value.type]),
    tap((next: any) => this.store.set('list', next))
  );
  schedule$: Observable<any[]> = this.date$.pipe(
    tap((next: any) => this.store.set('date', next)),
    map((day: any) => {
      const startAt = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
      const endAt = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1).getTime() - 1;
      return { startAt, endAt };
    }),
    switchMap(({ startAt, endAt }) => this.getSchedule(startAt, endAt)),
    map((data: any) => {
      const mapped: ScheduleList = {};
      for (const prop of data) {
        if (!mapped[prop.section]) {
          mapped[prop.section] = prop;
        }
      }
      return mapped;
    }),
    tap((next: any) => this.store.set('schedule', next))
  );

  constructor(
    private authService: AuthService,
    private store: Store,
    private afDb: AngularFireDatabase
  ) {}

  get uid() {
    return this.authService.user.uid;
  }

  updateItems(items: string[]) {
    this.itemList$.next(items);
  }

  updateDate(date: Date) {
    this.date$.next(date);
  }

  selectSection(event) {
    this.section$.next(event);
  }

  createSection(payload: ScheduleItem) {
    return this.afDb.list(`schedule/${this.uid}`).push(payload);
  }

  updateSection(key: string, payload: ScheduleItem) {
    return this.afDb.object(`schedule/${this.uid}/${key}`).update(payload);
  }

  getSchedule(startAt: number, endAt: number) {
    return this.afDb.list(`schedule/${this.uid}`, ref =>
      ref.orderByChild('timestamp')
        .startAt(startAt)
        .endAt(endAt)
    ).valueChanges();
  }
}