import { Component, ChangeDetectionStrategy, OnInit, HostBinding } from '@angular/core';
import io from 'socket.io-client';
import { Store } from '@ngxs/store';
import { SetWatcherGroups, ChangeBackgroundImage } from './app.state';
import { HttpClient } from '@angular/common/http'
import { interval } from 'rxjs';
import { BackgroundType } from './background-selector/background-selector.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  currentBackgroundType = BackgroundType.Dark
  BackgroundType = BackgroundType
  currentVersion: string
  constructor(private store: Store, private http: HttpClient) {}

  ngOnInit() {
    const socket = io()
    socket.on('message', data => {
      console.log(data)
    })

    socket.on('watchers', data => {
      this.store.dispatch(new SetWatcherGroups(data))
    })

    socket.on('version', data => {
      console.log({version: data})
      if (!this.currentVersion) {
        this.currentVersion = data
      }

      if (this.currentVersion !== data) {
        window.location.reload()
      }
    })

    interval(60 * 1000).subscribe(() => {
      this.store.dispatch(new ChangeBackgroundImage())
    })

    const savedbackgroundType = localStorage.getItem('backgroundType') as BackgroundType
    if (savedbackgroundType) {
      this.onSelectBackgroundType(savedbackgroundType)
    } else {
      localStorage.setItem('backgroundType', this.currentBackgroundType)
    }
  }

  onStartAll() {
    this.http.post('/api/start-all', null).toPromise()
  }

  onClearAll() {
    this.http.post('/api/clear-all', null).toPromise()
  }

  onChangeBackground() {
    this.store.dispatch(new ChangeBackgroundImage())
  }

  onSelectBackgroundType(backgroundType: BackgroundType) {
    this.currentBackgroundType = backgroundType
    localStorage.setItem('backgroundType', this.currentBackgroundType)
  }

  @HostBinding('class.light-theme')
  get isLightTheme() {
    return this.currentBackgroundType === BackgroundType.Light
  }
}
