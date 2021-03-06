import * as fromRoot from '../../../app/state/state';
import {ChangePasswordState} from './change-password.reducer';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface State extends fromRoot.State {
  changePassword: ChangePasswordState;
}

const getChangePasswordFeatureState = createFeatureSelector<ChangePasswordState>('changePassword');

export const getChangePasswordError = createSelector(
  getChangePasswordFeatureState,
  state => state.error
);

export const getChangePasswordSpinner = createSelector(
  getChangePasswordFeatureState,
  state => state.showSpinner
);

