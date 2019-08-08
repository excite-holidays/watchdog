import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import io from 'socket.io-client';
import { Store } from '@ngxs/store';
import { SetWatcherGroups, ChangeBackgroundImage } from './app.state';
import { HttpClient } from '@angular/common/http'
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(private store: Store, private http: HttpClient) {}

  ngOnInit() {
    const socket = io()
    socket.on('message', data => {
      console.log(data)
    })

    socket.on('watchers', data => {
      this.store.dispatch(new SetWatcherGroups(data))
    })

    interval(60 * 1000).subscribe(() => {
      this.store.dispatch(new ChangeBackgroundImage())
    })
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
}
