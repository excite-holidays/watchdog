import { Watcher } from './watcher.model';

export interface Group {
  name: string
  watchers: Watcher[]
}
