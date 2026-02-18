import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR } from '../const';
import { FullOffer } from '../types/offer';
import { AuthData, UserData } from '../types/user-data';
import {
  offersCityList,
  requireAuthorization,
  setError,
  setOffersDataLoadingStatus,
} from './action';
import { dropToken, getToken, saveToken } from '../services/token';
import { AppDispatch, State } from '../types/state';

type OfferDto = {
  id: string;
  title: string;
  type: 'apartment' | 'room' | 'house' | 'hotel';
  price: number;
  city: FullOffer['city'];
  location: {
    latitude: number;
    longitude: number;
  };
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage: string;
};

const normalizeOffer = (offer: OfferDto): FullOffer => ({
  id: offer.id,
  title: offer.title,
  type: offer.type,
  price: offer.price,
  city: offer.city,
  location: {
    latitude: offer.location.latitude,
    longitude: offer.location.longitude,
    zoom: offer.city.location.zoom,
  },
  isFavorite: offer.isFavorite,
  isPremium: offer.isPremium,
  rating: offer.rating,
  description: 'Описание недоступно',
  bedrooms: 1,
  goods: [],
  host: {
    name: 'Unknown',
    avatarUrl: '/img/avatar-max.jpg',
    isPro: false,
  },
  images: [offer.previewImage],
  maxAdults: 1,
});

type ThunkApi = {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
};

const fetchOfferAction = createAsyncThunk<void, undefined, ThunkApi>(
  'data/fetchOffers',
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setOffersDataLoadingStatus(true));
    try {
      const { data } = await api.get<OfferDto[]>(APIRoute.Offers);
      const normalizedData = data.map(normalizeOffer);
      dispatch(offersCityList(normalizedData));
    } finally {
      dispatch(setOffersDataLoadingStatus(false));
    }
  }
);

const checkAuthAction = createAsyncThunk<void, undefined, ThunkApi>(
  'user/checkAuth',
  async (_arg, { dispatch, extra: api }) => {
    if (!getToken()) {
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
      return;
    }

    try {
      await api.get(APIRoute.Login);
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
    } catch {
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    }
  }
);

const loginAction = createAsyncThunk<UserData, AuthData, ThunkApi & { rejectValue: string }>(
  'user/login',
  async ({ email, password }, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<UserData>(APIRoute.Login, { email, password });
      saveToken(data.token);
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
      return data;
    } catch {
      dropToken();
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
      return rejectWithValue('Login failed');
    }
  }
);

const logoutAction = createAsyncThunk<void, undefined, ThunkApi>(
  'user/logout',
  async (_arg, { dispatch, extra: api }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
    dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
  }
);

const clearErrorAction = createAsyncThunk<void, undefined, { dispatch: AppDispatch }>(
  'clearError',
  async (_arg, { dispatch }) => {
    setTimeout(() => dispatch(setError(null)), TIMEOUT_SHOW_ERROR);
  }
);

export { checkAuthAction, clearErrorAction, fetchOfferAction, loginAction, logoutAction };
