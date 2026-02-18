import { createAction } from '@reduxjs/toolkit';
import { OffersList } from '../types/offer';
import { AuthorizationStatusType } from '../types/authorization-status';

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
export const toggleFavorite = createAction<string>('offers/toggleFavorite');
