import { createReducer, on } from "@ngrx/store";
import { initialState } from "./orgsetup.store";
import * as fromAction from './orgsetup.action'



export const _setupOrgReducer = createReducer(
    initialState,
    on(fromAction.getVendorListSuccess, (state, action) => {
      return {
        ...state,
        vendorList:action.getvendor,
      };
    }),
    on(fromAction.getOranizationSuccess,(state, action) => {
      return {
        ...state,
        organizationList:action.getOranization,
      };
    }),
    on(fromAction.getLocationListSuccess,(state, action) => {
      return {
        ...state,
        locationList:action.getLocation,
      };
    }),
)

export function setuporgReducer(state, action) {
    return _setupOrgReducer(state, action);
  }