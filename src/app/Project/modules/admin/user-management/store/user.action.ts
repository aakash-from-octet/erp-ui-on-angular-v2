import { createAction, props } from "@ngrx/store";
import * as userModel from '../model/user.model';



export const GET_ROLE_LIST_START = '[get role ] get role details from user';
export const GET_ROLE_LIST_SUCCESS = '[get role ] get role details from user success';

export const getRoleListStart = createAction(GET_ROLE_LIST_START, props<{ postData }>());
export const getRoleListSuccess = createAction(GET_ROLE_LIST_SUCCESS, props<{ getRole: userModel.IRoleList }>());