import { Watcher } from './../models/watcher';
import { AppState } from './../app.state';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AppStateModel } from '../models/app-state.model';
import { trigger, transition, style, animate, state, AnimationEvent } from '@angular/animations';

@Component({
  selector: 'app-watchers',
  templateUrl: './watchers.component.html',
  styleUrls: ['./watchers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('modalCardIn', [
      state(
        'void',
        style({ opacity: 0, transform: 'scale(0.9) translateY(1rem)' })
      ),
      transition(':enter', animate('.5s cubic-bezier(0.19, 1, 0.22, 1)')),
      transition(':leave', animate('.5s cubic-bezier(0.19, 1, 0.22, 1)')),
    ]),
    trigger('modalBackgroundIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', animate('.5s cubic-bezier(0.19, 1, 0.22, 1)')),
      transition(':leave', animate('.5s cubic-bezier(0.19, 1, 0.22, 1)')),
    ]),
  ],
})
export class WatchersComponent implements OnInit {
  @Select(AppState) app$: Observable<AppStateModel>
  currentWatcher: Watcher
  modalActive = false
  constructor() {}

  ngOnInit() {}

  onOpen(watcher: Watcher) {
    this.currentWatcher = watcher
  }

  onClose() {
    this.currentWatcher = null
  }

  onAnimationEvent(e: AnimationEvent) {
    if (e.phaseName === 'start' && e.fromState === 'void') {
      this.modalActive = true
    }
    if (e.phaseName === 'done' && e.toState === 'void') {
      this.modalActive = false
    }
  }
}
