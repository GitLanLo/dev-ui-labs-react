import { State } from '../types/state';
import { AuthorizationStatusType } from '../types/authorization-status';

export const getAuthorizationStatus = (
  state: State
): AuthorizationStatusType => state.authorizationStatus;
