import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RolesService } from "../services/roles.service";
import * as fromAction from './user.action';
import { exhaustMap, map } from "rxjs";
import * as userModel from '../model/user.model';

@Injectable()

export class userEffect{
    constructor(
    private actions$: Actions,
    private service:RolesService,
    ){

    }


  getRoleList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromAction.getRoleListStart),
      exhaustMap(() => {
        return this.service.getRole().pipe(
          map((getRole: userModel.IRoleList) => {
            return fromAction.getRoleListSuccess({ getRole });
          })
        );
      })
    );
  });
}