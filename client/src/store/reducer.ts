import { createReducer } from '@reduxjs/toolkit';
import { changeCity, loadOffers, toggleFavorite } from './action';
import { CITIES_LOCATION, DEFAULT_CITY_NAME } from '../const';
import { OffersList } from '../types/offer';
import { fullOffers } from '../mocks/offers';

type OffersProcess = {
  cityName: string;
  offers: OffersList;
};

const initialCityName =
  CITIES_LOCATION.find((city) => city.name === DEFAULT_CITY_NAME)?.name ??
  CITIES_LOCATION[0].name;

const initialState: OffersProcess = {
  cityName: initialCityName,
  offers: fullOffers,
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      const newCity = CITIES_LOCATION.find((city) => city.name === action.payload);
      if (newCity) {
        state.cityName = newCity.name;
      }
    })
    .addCase(loadOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(toggleFavorite, (state, action) => {
      const offer = state.offers.find((item) => item.id === action.payload);
      if (offer) {
        offer.isFavorite = !offer.isFavorite;
      }
    });
});
