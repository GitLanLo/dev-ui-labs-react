import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LoginPage } from '../pages/login-page/login-page';
import { AppRoute, AuthorizationStatus } from '../const';
import { renderWithProviders } from './render-with-providers';

describe('LoginPage', () => {
  it('renders sign in form', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('allows user to type email and password', async () => {
    renderWithProviders(<LoginPage />);
    const user = userEvent.setup();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'Password1');

    expect(emailInput).toHaveValue('test@test.com');
    expect(passwordInput).toHaveValue('Password1');
  });

  it('hides form for authenticated user on /login', () => {
    renderWithProviders(<LoginPage />, {
      storeOverrides: {
        authorizationStatus: AuthorizationStatus.Auth,
      },
      initialEntries: [AppRoute.Login],
    });

    expect(screen.queryByPlaceholderText(/email/i)).not.toBeInTheDocument();
  });

  it('shows form for unauthenticated user on /login', () => {
    renderWithProviders(<LoginPage />, {
      storeOverrides: {
        authorizationStatus: AuthorizationStatus.NoAuth,
      },
      initialEntries: [AppRoute.Login],
    });

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });
});
