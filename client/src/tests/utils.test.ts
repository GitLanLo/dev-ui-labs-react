import { describe, expect, it } from 'vitest';
import { CITIES_LOCATION, SortOffersType } from '../const';
import { getOffersByCity, sortOffersByType } from '../utils';
import { makeFakeOffer } from './mocks';

describe('getOffersByCity', () => {
  it('returns only offers from selected city', () => {
    const paris = CITIES_LOCATION[0];
    const cologne = CITIES_LOCATION[1];
    const parisOffer = { ...makeFakeOffer(), city: paris };
    const cologneOffer = { ...makeFakeOffer(), city: cologne };

    const result = getOffersByCity('Paris', [parisOffer, cologneOffer]);

    expect(result).toHaveLength(1);
    expect(result[0].city.name).toBe('Paris');
  });

  it('returns empty array when city does not exist', () => {
    const offers = [makeFakeOffer(), makeFakeOffer()];

    expect(getOffersByCity('Tokyo', offers)).toEqual([]);
  });

  it('returns empty array for empty offers list', () => {
    expect(getOffersByCity('Paris', [])).toEqual([]);
  });
});

describe('sortOffersByType', () => {
  it('sorts offers by price from low to high', () => {
    const offers = [
      { ...makeFakeOffer(), price: 300 },
      { ...makeFakeOffer(), price: 100 },
      { ...makeFakeOffer(), price: 200 },
    ];

    const result = sortOffersByType(offers, SortOffersType.PriceLowToHigh);

    expect(result.map((offer) => offer.price)).toEqual([100, 200, 300]);
  });

  it('sorts offers by price from high to low', () => {
    const offers = [
      { ...makeFakeOffer(), price: 100 },
      { ...makeFakeOffer(), price: 300 },
      { ...makeFakeOffer(), price: 200 },
    ];

    const result = sortOffersByType(offers, SortOffersType.PriceHighToLow);

    expect(result.map((offer) => offer.price)).toEqual([300, 200, 100]);
  });

  it('sorts offers by rating for TopRatedFirst', () => {
    const offers = [
      { ...makeFakeOffer(), rating: 3 },
      { ...makeFakeOffer(), rating: 5 },
      { ...makeFakeOffer(), rating: 4 },
    ];

    const result = sortOffersByType(offers, SortOffersType.TopRatedFirst);

    expect(result.map((offer) => offer.rating)).toEqual([5, 4, 3]);
  });

  it('returns a new array for Popular', () => {
    const offers = [makeFakeOffer(), makeFakeOffer()];

    const result = sortOffersByType(offers, SortOffersType.Popular);

    expect(result).toEqual(offers);
    expect(result).not.toBe(offers);
  });

  it('does not mutate the source array', () => {
    const offers = [
      { ...makeFakeOffer(), price: 100 },
      { ...makeFakeOffer(), price: 200 },
    ];
    const copy = [...offers];

    sortOffersByType(offers, SortOffersType.PriceLowToHigh);

    expect(offers).toEqual(copy);
  });

  it('returns empty array for empty offers list', () => {
    expect(sortOffersByType([], SortOffersType.PriceLowToHigh)).toEqual([]);
  });
});
