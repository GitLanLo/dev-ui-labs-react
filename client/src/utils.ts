import { FullOffer, OffersList } from './types/offer';
import { SortType } from './types/sort';
import { SortOffersType } from './const';

export function getOffersByCity(cityName: string, offers: OffersList): OffersList {
  const normalizedCityName = cityName.trim().toLowerCase();

  return offers.filter((offer) => offer.city.name.trim().toLowerCase() === normalizedCityName);
}

export function sortOffersByType(offers: FullOffer[], sortType: SortType): FullOffer[] {
  switch (sortType) {
    case SortOffersType.PriceLowToHigh:
      return [...offers].sort((a, b) => a.price - b.price);

    case SortOffersType.PriceHighToLow:
      return [...offers].sort((a, b) => b.price - a.price);

    case SortOffersType.TopRatedFirst:
      return [...offers].sort((a, b) => b.rating - a.rating);

    case SortOffersType.Popular:
    default:
      return [...offers];
  }
}

export function sortOffers(offers: FullOffer[], sortType: SortType): FullOffer[] {
  return sortOffersByType(offers, sortType);
}
