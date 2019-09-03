import { WatcherGroup } from './watcher-group'

export interface AppStateModel {
  watcherGroups: WatcherGroup[]
  componentNames: string[]
}
