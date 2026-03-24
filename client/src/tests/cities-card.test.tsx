import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CitiesCard } from '../components/cities-card/cities-card';
import { AppRoute } from '../const';
import { makeFakeOffer } from './mocks';
import { renderWithProviders } from './render-with-providers';

describe('CitiesCard', () => {
  it('renders offer title', () => {
    const offer = makeFakeOffer();

    renderWithProviders(<CitiesCard offer={offer} />);

    expect(screen.getByText(offer.title)).toBeInTheDocument();
  });

  it('renders offer price', () => {
    const offer = makeFakeOffer();

    renderWithProviders(<CitiesCard offer={offer} />);

    expect(screen.getByText(`€${offer.price}`)).toBeInTheDocument();
  });

  it('renders Premium label when offer is premium', () => {
    const offer = { ...makeFakeOffer(), isPremium: true };

    renderWithProviders(<CitiesCard offer={offer} />);

    expect(screen.getByText(/premium/i)).toBeInTheDocument();
  });

  it('does not render Premium label when offer is not premium', () => {
    const offer = { ...makeFakeOffer(), isPremium: false };

    renderWithProviders(<CitiesCard offer={offer} />);

    expect(screen.queryByText(/premium/i)).not.toBeInTheDocument();
  });

  it('renders offer link with id in href', () => {
    const offer = makeFakeOffer();

    renderWithProviders(<CitiesCard offer={offer} />);

    const offerLinks = screen.getAllByRole('link', { name: offer.title });

    expect(offerLinks[0]).toHaveAttribute('href', AppRoute.Offer.replace(':id', offer.id));
    expect(offerLinks[1]).toHaveAttribute('href', AppRoute.Offer.replace(':id', offer.id));
  });
});
