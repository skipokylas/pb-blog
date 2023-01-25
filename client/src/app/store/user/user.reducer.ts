import { createReducer } from '@ngrx/store';
import { initialUserState } from './user.state';

export interface UserState {
  address: string | undefined;
  meta: {
    genesisHash: string | undefined,
    name: string | undefined,
    source: string | undefined
  };
  type: string | undefined;
}

export const UserReducer = createReducer<UserState>(
  initialUserState
);
