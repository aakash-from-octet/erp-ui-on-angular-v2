import { createReducer, on } from "@ngrx/store";
import { initialState } from "./user.store";
import * as fromAction from './user.action'



export const _userManagementReducerReducer = createReducer(
    initialState,
    on(fromAction.getRoleListSuccess, (state, action) => {
      return {
        ...state,
        getRoleList:action.getRole,
      };
    }),
)

export function userManagementReducer(state, action) {
    return _userManagementReducerReducer(state, action);
  }