import { setuporgReducer } from "../modules/admin/org-setup/store/orgsetup.reducer";
import { orgsetupchangeFeatureKey } from "../modules/admin/org-setup/store/orgsetup.store";
import {orgsetupState} from '../modules/admin/org-setup/store/orgsetup.store'
import {  userManagementReducer } from "../modules/admin/user-management/store/user.reducer";
import { userManagementchangeFeatureKey, userRolesState } from "../modules/admin/user-management/store/user.store";
export const appFeatureKey = 'app';
export interface AppState {
    [orgsetupchangeFeatureKey]:orgsetupState
    [userManagementchangeFeatureKey]:userRolesState
}

export const appReducer = {
    [orgsetupchangeFeatureKey]:setuporgReducer,
    [userManagementchangeFeatureKey]:userManagementReducer
}