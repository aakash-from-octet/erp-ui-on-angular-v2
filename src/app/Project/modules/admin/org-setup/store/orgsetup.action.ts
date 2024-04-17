import { createAction, props } from "@ngrx/store";
import * as fromModel from '../model/vendor.model';
import * as orgModel from '../model/organization.model'
import * as locationModel from '../model/location.model'



// Get Vendor list api
export const GET_VENDOR_LIST_START = '[get vendor ] get vendor details from orgsetup';
export const GET_VENDOR_LIST_SUCCESS = '[get vendor ] get vendor details from orgsetup success';

export const getVendorListStart = createAction(GET_VENDOR_LIST_START, props<{ postData }>());
export const getVendorListSuccess = createAction(GET_VENDOR_LIST_SUCCESS, props<{ getvendor: fromModel.IvendorList }>());


// oragnization get api 
export const GET_ORGANIZATION_LIST_START = '[get organization ] get organization details from orgsetup';
export const GET_ORGANIZATION_LIST_SUCCESS = '[get organization ] get organization details from orgsetup success';

export const getOranizationListStart = createAction(GET_ORGANIZATION_LIST_START, props<{ postData }>());
export const getOranizationSuccess = createAction(GET_ORGANIZATION_LIST_SUCCESS, props<{ getOranization: orgModel.IoraganizationList }>());


// location get api
export const GET_LOCATION_LIST_START = '[get location ] get location details from orgsetup';
export const GET_LOCATION_LIST_SUCCESS = '[get location ] get location details from orgsetup success';

export const getLocationListStart = createAction(GET_LOCATION_LIST_START, props<{ postData }>());
export const getLocationListSuccess = createAction(GET_LOCATION_LIST_SUCCESS, props<{ getLocation: locationModel.IlocationList }>());