import { ActionReducerMap } from '@ngrx/store';
import { UserReducer, UserState } from './user/user.reducer';

interface State {
  userState: UserState
}

export const reducers: ActionReducerMap<State> = {
  userState: UserReducer,
};
