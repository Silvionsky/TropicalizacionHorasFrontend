import { ActivitiesService } from '../activities.service';
import {Actions, Effect, ofType, createEffect} from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { ActivityActionTypes,
  LoadActivity,
  LoadSuccessful,
  LoadFailed,
  DeleteActivity,
  DeleteSuccessful,
  AddActivity,
  AddSuccessful,
  AddFailed,
  AddActivityFiles,
  UpdateFilesProgress,
  LoadActivityDetails,
  LoadActivityDetailsSuccessful,
  LoadActivityDetailsFail,
  UpdateActivity,
  UpdateFailed,
  UpdateSuccessful} from './activities.actions';
import { map, mergeMap, catchError, switchMap, tap } from 'rxjs/operators';
import { Activity } from 'src/models/activity.model';
import { Injectable } from '@angular/core';
import { CustomResponse } from 'src/models/custom-response.model';
import { Router } from '@angular/router';
import { Archivo } from 'src/models/archivo.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class ActivityEffects {
  constructor(
    private activitiesService: ActivitiesService,
    private actions$: Actions,
    private router: Router,
    private spinner: NgxSpinnerService) {}

  @Effect()
  loadActivityDetails$: Observable<Action> = this.actions$.pipe(
    ofType(ActivityActionTypes.LoadActivityDetails),
    map((action: LoadActivityDetails) => action.payload),
    mergeMap((id: number) =>
      this.activitiesService.getActivityDetails(id).pipe(
        map((content: {activity: Activity, files: []}) => {
          this.spinner.hide();
          return new LoadActivityDetailsSuccessful(content);
        }),
        catchError((err: CustomResponse) => {
          this.spinner.hide();
          return of(new LoadActivityDetailsFail(err.errorMessages));
        })
      )
    )
  );

  @Effect()
  loadActivities$: Observable<Action> = this.actions$.pipe(
    ofType(ActivityActionTypes.LoadActivity),
    map((action: LoadActivity) => action.payload),
    mergeMap((email: string) =>
      this.activitiesService.getActivities(email).pipe(
        map( (activities: Activity[]) => {
          this.spinner.hide();
          return new LoadSuccessful(activities);
        }),
        catchError((err: CustomResponse) => {
          this.spinner.hide();
          return of(new LoadFailed(err.errorMessages));
        })
      )
    )
  );

  @Effect()
  addActivity$: Observable<Action> = this.actions$.pipe(
    ofType(ActivityActionTypes.AddActivity),
    map((action: AddActivity) => action.payload),
    mergeMap((content: {activity: Activity, files: Set<File>}) =>
      this.activitiesService.postActivity(content.activity).pipe(
        map(res => {
          if (content.files.size !== 0) {
            const filePackage = {id: res, files: content.files};
            return new AddActivityFiles(filePackage);
          } else {
            this.router.navigate(['/actividades']);
            this.spinner.hide();
            return new AddSuccessful(content.activity);
          }
        }),
        catchError((err: CustomResponse) => {
          this.spinner.hide();
          return of(new AddFailed(err.errorMessages));
        })
      )
    )
  );

  @Effect()
  uploadFiles$: Observable<Action> = this.actions$.pipe(
    ofType(ActivityActionTypes.AddActivityFiles),
    map((action: AddActivityFiles) => action.payload),
    switchMap((content: {id: number, files: Set<File>}) =>
    this.activitiesService.uploadActivityFiles(content.id, content.files).pipe(
        map(res => {
          this.router.navigate(['/actividades']);
          this.spinner.hide();
          return new UpdateFilesProgress([]);
        }),
        catchError((err: CustomResponse) => {
          this.spinner.hide();
          return of(new AddFailed(err.errorMessages));
        })
      )
    )
  );

  @Effect()
  updateActivity$: Observable<Action> = this.actions$.pipe(
    ofType(ActivityActionTypes.UpdateActivity),
    map((action: UpdateActivity) => action.payload),
    mergeMap((content: {activity: Activity, files: Archivo[]}) =>
      this.activitiesService.modifyActivity(content.activity.idGenerado, content.activity).pipe(
        map(res => {
          this.router.navigate(['/actividades']);
          this.spinner.hide();
          return new UpdateSuccessful('');
        }),
        catchError((err: CustomResponse) => {
          this.spinner.hide();
          return of(new UpdateFailed(err.errorMessages));
        })
      )
    )
  );

  @Effect()
  deleteActivity$: Observable<Action> = this.actions$.pipe(
    ofType(ActivityActionTypes.DeleteActivity),
    map((action: DeleteActivity) => action.payload),
    mergeMap((id: number) =>
      this.activitiesService.deleteActivity(id).pipe(
        map(res => {
          this.spinner.hide();
          return new DeleteSuccessful(id);
        }),
        catchError((err: CustomResponse) => {
          this.spinner.hide();
          return of(new LoadFailed(err.errorMessages));
        })
      )
    )
  );
}