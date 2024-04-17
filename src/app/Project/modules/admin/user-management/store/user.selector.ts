import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromStore from './user.store';


const userManagementSelector = createFeatureSelector<fromStore.userRolesState>(
    fromStore.userManagementchangeFeatureKey
  );

  export const getRoleList = createSelector(userManagementSelector, (state) => {
    return state?.getRoleList;
  });