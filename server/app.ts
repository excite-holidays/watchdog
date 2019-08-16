import dotenv from 'dotenv'
dotenv.config()

import path from 'path'
import express from 'express'
import socketIo from 'socket.io'
import { Group } from './group.model';
import { db } from './db'
import { Worker } from './worker'
import { Subject } from 'rxjs'
import { shareReplay, takeUntil, startWith, map, distinctUntilChanged } from 'rxjs/operators'
import { isEqual } from 'lodash'

const eventEmitter$ = new Subject()
const groups = db.get('groups').value() as Group[]
const version = db.get('version').value() as string

groups.forEach((group) => {
  group.watchers.forEach((watcher) => {
    watcher.groupName = group.name
    watcher.worker = new Worker(watcher, eventEmitter$)
  })
})

// const events$ = eventEmitter$.pipe(
//   tap(n => console.log(new Date(), n)),
//   shareReplay(1),
// )
// events$.subscribe()

const watchers$ = eventEmitter$.pipe(
  startWith(1),
  map(() => {
    return groups.map((group) => {
      return {
        name: group.name,
        watchers: group.watchers.map(watcher => {
          const { id, name, url, enable, groupName } = watcher
          const { status, version, body } = watcher.worker
          return { id, name, url, enable, groupName, status, version, body }
        }),
      }
    })
  }),
  distinctUntilChanged((a, b) => {
    return isEqual(a, b)
  }),
  shareReplay(1),
)

const app = express()

app.use(express.static(path.join(__dirname, './public')))

const server = app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
)

const io = socketIo(server)
io.on('connect', socket => {
  console.log('Connected', socket.id)
  socket.emit('version', version)

  const disconnect$ = new Subject()
  watchers$.pipe(takeUntil(disconnect$)).subscribe((watchers) => {
    socket.emit('watchers', watchers)
  })

  socket.on('disconnect', () => {
    disconnect$.next()
    disconnect$.complete()
  })
})
