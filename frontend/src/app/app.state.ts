import { State, Action, StateContext } from '@ngxs/store';
import { AppStateModel } from './models/app-state.model';
import { WatcherGroup } from './models/watcher-group';

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
  },
})
export class AppState {
  @Action(SetWatcherGroups)
  SetWatcherGroups(ctx: StateContext<AppStateModel>, action: SetWatcherGroups) {
    ctx.patchState({ watcherGroups: action.watcherGroups })
  }
}
