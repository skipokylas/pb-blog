import { UserState } from './user.reducer';

export const initialUserState: UserState = {
  address: undefined,
  meta: {
    genesisHash: undefined,
    name: undefined,
    source: undefined
  },
  type: undefined,
}
