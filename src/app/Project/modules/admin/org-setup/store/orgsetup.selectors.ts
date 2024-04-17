import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromStore from './orgsetup.store';


const setupOrgSelector = createFeatureSelector<fromStore.orgsetupState>(
    fromStore.orgsetupchangeFeatureKey
  );

  export const getVendorList = createSelector(setupOrgSelector, (state) => {
    return state?.vendorList;
  });

  export const getOrganizationList = createSelector(setupOrgSelector, (state) => {
    return state?.organizationList;
  });


  export const getLocationList = createSelector(setupOrgSelector, (state) => {
    return state?.locationList;
  });