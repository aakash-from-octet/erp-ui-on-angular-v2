import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as locationModel from '../model/location.model';
import * as orgModel from '../model/organization.model';
import * as fromModel from '../model/vendor.model';
import * as fromAction from './orgsetup.action';

import { exhaustMap, map } from 'rxjs';
import { LocationService } from '../services/location.service';
import { OrganizationService } from '../services/organization.service';
import { vendorService } from '../services/vendors.services';

@Injectable()
export class DetailsEffects {
  constructor(
    private actions$: Actions,
    private vendorService: vendorService,
    private organizationService: OrganizationService,
    private locationService: LocationService
  ) {}

  getVendorList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromAction.getVendorListStart),
      exhaustMap(() => {
        return this.vendorService.getVendorList().pipe(
          map((getvendor: fromModel.IvendorList) => {
            return fromAction.getVendorListSuccess({ getvendor });
          })
        );
      })
    );
  });

  getOranizationList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromAction.getOranizationListStart),
      exhaustMap(() => {
        return this.organizationService.getOrganisation().pipe(
          map((getOranization: orgModel.IoraganizationList) => {
            return fromAction.getOranizationSuccess({ getOranization });
          })
        );
      })
    );
  });

  // location get api

  getLocationList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromAction.getLocationListStart),
      exhaustMap(() => {
        return this.locationService.getLocation().pipe(
          map((getLocation: locationModel.IlocationList) => {
            return fromAction.getLocationListSuccess({ getLocation });
          })
        );
      })
    );
  });
}
