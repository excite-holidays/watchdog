import { State, Action, StateContext } from '@ngxs/store';
import { AppStateModel } from './models/app-state.model';
import { WatcherGroup } from './models/watcher-group';
import { union } from 'lodash-es'

export class SetWatcherGroups {
  static readonly type = '[ App ] Set watcher groups'
  constructor(public watcherGroups: WatcherGroup[]) { }
}

export class ChangeBackgroundImage {
  static readonly type = '[ App ] Change background image'
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    watcherGroups: [],
    componentNames: []
  },
})
export class AppState {
  @Action(SetWatcherGroups)
  SetWatcherGroups(ctx: StateContext<AppStateModel>, action: SetWatcherGroups) {
    const componentNames = action.watcherGroups.map((g) => g.watchers.map((w) => w.name)).reduce((a, b) => union(a, b), [])
    const groups = action.watcherGroups.map((group) => {
      const watchers = componentNames.map((cName) => group.watchers.find((w) => w.name === cName))
      return { ...group, watchers }
    })

    ctx.patchState({ watcherGroups: groups, componentNames })
  }
}
