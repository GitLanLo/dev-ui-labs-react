import { createReducer } from '@reduxjs/toolkit';
import {
  changeCity,
  offersCityList,
  requireAuthorization,
  setError,
  setOffersDataLoadingStatus,
  toggleFavorite,
} from './action';
import { CITIES_LOCATION, DEFAULT_CITY_NAME } from '../const';
import { OffersList } from '../types/offer';
import { AuthorizationStatusType } from '../types/authorization-status';
import { AuthorizationStatus } from '../const';

type OffersProcess = {
  cityName: string;
  offers: OffersList;
  authorizationStatus: AuthorizationStatusType;
  error: string | null;
  isOffersDataLoading: boolean;
};

const initialCityName =
  CITIES_LOCATION.find((city) => city.name === DEFAULT_CITY_NAME)?.name ??
  CITIES_LOCATION[0].name;

const initialState: OffersProcess = {
  cityName: initialCityName,
  offers: [],
  authorizationStatus: AuthorizationStatus.Unknown,
  error: null,
  isOffersDataLoading: false,
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.cityName = action.payload;
    })
    .addCase(offersCityList, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(setOffersDataLoadingStatus, (state, action) => {
      state.isOffersDataLoading = action.payload;
    })
    .addCase(toggleFavorite, (state, action) => {
      const offer = state.offers.find((item) => item.id === action.payload);
      if (offer) {
        offer.isFavorite = !offer.isFavorite;
      }
    });
});
