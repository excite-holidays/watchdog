import { slackNotify } from './slack-notify';
import { Watcher } from './watcher.model';
import { timer, Subject, from, empty } from 'rxjs'
import got, { Response } from 'got'
import { take, repeat, takeUntil, tap, delay, share, switchMap, map, catchError } from 'rxjs/operators';
import { get } from 'lodash'

export class Worker {
  destroy$: Subject<any>
  status: 'init' | 'healthy' | 'down'
  version: string
  body: string

  constructor(public watcher: Watcher, private eventEmitter$: Subject<any>) {
    if (watcher.enable) {
      this.init()
    }
  }

  destroy() {
    if (this.destroy$) {
      this.destroy$.next()
      this.destroy$.complete()
    }
  }

  private init() {
    this.destroy$ = new Subject()
    this.status = 'init'
    this.eventEmitter$.next()
    const timer$ = timer(0, this.watcher.interval).pipe(share())
    timer$.pipe(takeUntil(this.destroy$)).subscribe()
    timer$
      .pipe(
        take(1),
        delay(2000),
        switchMap(() =>
          from(
            got(this.watcher.url, {
              headers: {
                Authorization: `Basic ${this.watcher.basicAuth}`
              },
            })
          )
        ),
        tap(resp => this.processResponse(resp)),
        catchError(e => {
          if (this.status === 'healthy') {
            slackNotify(`${this.watcher.name} - ${this.watcher.groupName} is down!`)
          }
          this.status = 'down'
          this.body = e.body || e.message
          return empty()
        }),
        repeat(),
        takeUntil(this.destroy$)
      )
      .subscribe()
  }

  private processResponse(resp: Response<string>) {
    const wasDown = this.status === 'down'
    try {
      const body = JSON.parse(resp.body)
      this.body = body
      const healthValue = get(body, this.watcher.healthKey)
      const versionValue = get(body, this.watcher.versionKey)
      this.status = String(healthValue) === this.watcher.healthValue ? 'healthy' : 'down'
      this.version = versionValue
    } catch(e) {
      this.body = resp.body
    }

    this.eventEmitter$.next()
    if (wasDown && this.status === 'healthy') {
      slackNotify(`${this.watcher.name} - ${this.watcher.groupName} is up!`)
    }
  }
}