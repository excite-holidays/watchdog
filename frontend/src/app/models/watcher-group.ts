import { Watcher } from './watcher';
export interface WatcherGroup {
  name: string
  watchers: Watcher[]
}
