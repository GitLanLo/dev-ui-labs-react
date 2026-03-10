import { createAction } from '@reduxjs/toolkit';
import { FullOffer, OffersList } from '../types/offer';
import { AuthorizationStatusType } from '../types/authorization-status';
import { Reviews } from '../types/review';
import { UserData } from '../types/user-data';

export const changeCity = createAction<string>('offers/changeCity');
export const offersCityList = createAction<OffersList>('offers/offersCityList');
export const requireAuthorization = createAction<AuthorizationStatusType>(
  'user/requireAuthorization'
);
export const setError = createAction('setError', (error: string | null) => ({
  payload: error,
}));
export const setOffersDataLoadingStatus = createAction<boolean>(
  'data/setOffersDataLoadingStatus'
);
export const setOfferDetailsLoadingStatus = createAction<boolean>(
  'data/setOfferDetailsLoadingStatus'
);
export const setCurrentOffer = createAction<FullOffer | null>('data/setCurrentOffer');
export const setOfferReviews = createAction<Reviews>('data/setOfferReviews');
export const setUserData = createAction<UserData | null>('user/setUserData');
export const setFavoriteStatus = createAction<{ offerId: string; isFavorite: boolean }>(
  'offers/setFavoriteStatus'
);
