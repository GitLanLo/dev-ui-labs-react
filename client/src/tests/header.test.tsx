import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from '../components/header/header';
import { AuthorizationStatus } from '../const';
import { makeFakeOffer, makeFakeUserData } from './mocks';
import { renderWithProviders } from './render-with-providers';

describe('Header', () => {
  it('shows Sign in for unauthenticated user', () => {
    renderWithProviders(<Header />);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.queryByText(/sign out/i)).not.toBeInTheDocument();
  });

  it('shows user email, favorites count and Sign out for authenticated user', () => {
    const favoriteOffer = { ...makeFakeOffer(), isFavorite: true };
    const secondFavoriteOffer = { ...makeFakeOffer(), isFavorite: true };
    const userData = makeFakeUserData();

    renderWithProviders(<Header />, {
      storeOverrides: {
        authorizationStatus: AuthorizationStatus.Auth,
        userData,
        offers: [favoriteOffer, secondFavoriteOffer],
      },
    });

    expect(screen.getByText(userData.email)).toBeInTheDocument();
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
