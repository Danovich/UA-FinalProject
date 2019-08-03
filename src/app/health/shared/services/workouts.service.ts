import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Observable, of } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

import { Store } from 'store';
import { AuthService } from '../../../auth/shared/services/auth.service';

export interface Workout {
  name: string,
  type: string, // endurance | strenth
  strenth: any,
  endurance: any,
  timestamp: number,
  $key: string,
  $exists: () => boolean
}

@Injectable()
export class WorkoutsService {
  workouts$: Observable<any> = this.afDb.list<Workout[]>(`workouts/${this.uid}`).snapshotChanges().pipe(
    map(actions => {
      return actions.map(action => {
        const data = action.payload.val();
        const $key = action.payload.key;
        return { $key, ...data };
      });
    }),
    tap(next => this.store.set('workouts', next))
  );

  constructor(
    private store: Store,
    private afDb: AngularFireDatabase,
    private authService: AuthService
  ) { }

  get uid() {
    return this.authService.user.uid;
  }

  getWorkout(key: string) {
    if (!key) { return of({}); }
    return this.store.select<Workout[]>('workouts').pipe(
      filter(Boolean),
      map(workouts => workouts.find((workout: Workout) => workout.$key === key))
    );
  }

  addWorkout(workout: Workout) {
    return this.afDb.list(`workouts/${this.uid}`).push(workout);
  }

  updateWorkout(key: string, workout: Workout) {
    return this.afDb.object(`workouts/${this.uid}/${key}`).update(workout);
  }

  removeWorkout(key: string) {
    return this.afDb.list(`workouts/${this.uid}`).remove(key);
  }

}