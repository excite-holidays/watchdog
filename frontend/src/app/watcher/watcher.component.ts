import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core'
import { Watcher } from '../models/watcher';

@Component({
  selector: 'app-watcher',
  templateUrl: './watcher.component.html',
  styleUrls: ['./watcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatcherComponent implements OnInit {

  @Input() watcher: Watcher
  @Output() open = new EventEmitter()

  constructor() { }

  ngOnInit() { }

  onOpen() {
    this.open.emit(this.watcher)
  }
}
