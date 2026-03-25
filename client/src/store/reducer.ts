import { createReducer } from '@reduxjs/toolkit';
import {
  changeCity,
  setCurrentOffer,
  setOfferDetailsLoadingStatus,
  setOfferReviews,
  offersCityList,
  requireAuthorization,
  setError,
  setFavoriteStatus,
  setOffersDataLoadingStatus,
  setOffersLoadErrorStatus,
  setUserData,
} from './action';
import { CITIES_LOCATION, DEFAULT_CITY_NAME } from '../const';
import { FullOffer, OffersList } from '../types/offer';
import { AuthorizationStatusType } from '../types/authorization-status';
import { AuthorizationStatus } from '../const';
import { Reviews } from '../types/review';
import { UserData } from '../types/user-data';

type OffersProcess = {
  cityName: string;
  offers: OffersList;
  currentOffer: FullOffer | null;
  offerReviews: Reviews;
  authorizationStatus: AuthorizationStatusType;
  userData: UserData | null;
  error: string | null;
  isOffersDataLoading: boolean;
  hasOffersLoadError: boolean;
  isOfferDetailsLoading: boolean;
};

export type InitialState = OffersProcess;

const initialCityName =
  CITIES_LOCATION.find((city) => city.name === DEFAULT_CITY_NAME)?.name ??
  CITIES_LOCATION[0].name;

export const initialState: InitialState = {
  cityName: initialCityName,
  offers: [],
  currentOffer: null,
  offerReviews: [],
  authorizationStatus: AuthorizationStatus.Unknown,
  userData: null,
  error: null,
  isOffersDataLoading: true,
  hasOffersLoadError: false,
  isOfferDetailsLoading: false,
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.cityName = action.payload;
    })
    .addCase(offersCityList, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(setCurrentOffer, (state, action) => {
      state.currentOffer = action.payload;
    })
    .addCase(setOfferReviews, (state, action) => {
      state.offerReviews = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setUserData, (state, action) => {
      state.userData = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(setOffersDataLoadingStatus, (state, action) => {
      state.isOffersDataLoading = action.payload;
    })
    .addCase(setOffersLoadErrorStatus, (state, action) => {
      state.hasOffersLoadError = action.payload;
    })
    .addCase(setOfferDetailsLoadingStatus, (state, action) => {
      state.isOfferDetailsLoading = action.payload;
    })
    .addCase(setFavoriteStatus, (state, action) => {
      const { offerId, isFavorite } = action.payload;
      const offer = state.offers.find((item) => item.id === offerId);

      if (offer) {
        offer.isFavorite = isFavorite;
      }

      if (state.currentOffer && state.currentOffer.id === offerId) {
        state.currentOffer.isFavorite = isFavorite;
      }
    });
});
