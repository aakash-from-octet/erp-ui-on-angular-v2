import { IlocationList } from "../model/location.model";
import { IoraganizationList } from "../model/organization.model";
import { IvendorList } from "../model/vendor.model";


export const orgsetupchangeFeatureKey = 'orgsetup';

export interface orgsetupState{
    vendorList:IvendorList,
    organizationList:IoraganizationList
    locationList:IlocationList

}

export const initialState:orgsetupState={
    vendorList:null,
    organizationList:null,
    locationList:null
}