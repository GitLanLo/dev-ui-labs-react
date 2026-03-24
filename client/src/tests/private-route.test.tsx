import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PrivateRoute } from '../components/private-route/private-route';
import { AppRoute, AuthorizationStatus } from '../const';

const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

function renderPrivateRoute(status: (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus]) {
  return render(
    <MemoryRouter initialEntries={[AppRoute.Favorites]} future={routerFutureConfig}>
      <Routes>
        <Route
          path={AppRoute.Favorites}
          element={
            <PrivateRoute authorizationStatus={status}>
              <div data-testid="protected">Избранное</div>
            </PrivateRoute>
          }
        />
        <Route path={AppRoute.Login} element={<div data-testid="login-page">Страница входа</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('PrivateRoute', () => {
  it('renders protected content for authenticated user', () => {
    renderPrivateRoute(AuthorizationStatus.Auth);

    expect(screen.getByTestId('protected')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });

  it('redirects to login for unauthenticated user', () => {
    renderPrivateRoute(AuthorizationStatus.NoAuth);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
  });

  it('redirects to login for unknown auth status', () => {
    renderPrivateRoute(AuthorizationStatus.Unknown);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
