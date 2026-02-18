import { Navigate } from 'react-router-dom';
import { AuthorizationStatus, AppRoute } from '../../const';
import { ReactNode } from 'react';
import { AuthorizationStatusType } from '../../types/authorization-status';

type PrivateRouteProps = {
  authorizationStatus: AuthorizationStatusType;
  children: ReactNode;
};

function PrivateRoute({ authorizationStatus, children }: PrivateRouteProps) {
  return authorizationStatus === AuthorizationStatus.Auth ? (
    <>{children}</>
  ) : (
    <Navigate to={AppRoute.Login} />
  );
}

export { PrivateRoute };
