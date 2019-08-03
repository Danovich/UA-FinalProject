import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Observable, of } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

import { Store } from 'store';
import { AuthService } from '../../../auth/shared/services/auth.service';

export interface Meal {
  name: string,
  ingredients: string[],
  timestamp: number,
  $key: string,
  $exists: () => boolean
}

@Injectable()
export class MealsService {
  meals$: Observable<any> = this.afDb.list<Meal[]>(`meals/${this.uid}`).snapshotChanges().pipe(
    map(actions => {
      return actions.map(action => {
        const data = action.payload.val();
        const $key = action.payload.key;
        return { $key, ...data };
      });
    }),
    tap(next => this.store.set('meals', next))
  );

  constructor(
    private store: Store,
    private afDb: AngularFireDatabase,
    private authService: AuthService
  ) {}

  get uid() {
    return this.authService.user.uid;
  }

  getMeal(key: string) {
    if (!key) { return of({}); }
    return this.store.select<Meal[]>('meals').pipe(
      filter(Boolean),
      map(meals => meals.find((meal: Meal) => meal.$key === key))
    );
  }

  addMeal(meal: Meal) {
    return this.afDb.list(`meals/${this.uid}`).push(meal);
  }

  updateMeal(key: string, meal: Meal) {
    return this.afDb.object(`meals/${this.uid}/${key}`).update(meal);
  }

  removeMeal(key: string) {
    return this.afDb.list(`meals/${this.uid}`).remove(key);
  }

}