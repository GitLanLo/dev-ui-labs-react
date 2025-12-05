import { createReducer } from '@reduxjs/toolkit';
import { changeCity, loadOffers } from './action';
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
    });
});
