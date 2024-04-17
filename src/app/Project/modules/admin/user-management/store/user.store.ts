import { IRoleList } from "../model/user.model";


export const userManagementchangeFeatureKey = 'userManagement';

export interface userRolesState{
    getRoleList:IRoleList
}

export const initialState:userRolesState={
    getRoleList:null
}