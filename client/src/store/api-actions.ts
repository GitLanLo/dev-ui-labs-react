import { AxiosInstance, isAxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR } from '../const';
import { FullOffer } from '../types/offer';
import { Reviews } from '../types/review';
import { AuthData, UserData } from '../types/user-data';
import {
  setCurrentOffer,
  setFavoriteStatus,
  setOfferDetailsLoadingStatus,
  setOfferReviews,
  offersCityList,
  requireAuthorization,
  setError,
  setOffersDataLoadingStatus,
  setUserData,
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

type FavoriteDto = {
  id?: string | number;
  isFavorite: boolean;
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
      dispatch(setUserData(null));
      return;
    }

    try {
      const { data } = await api.get<UserData>(APIRoute.Login);
      dispatch(setUserData(data));
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
    } catch {
      dropToken();
      dispatch(setUserData(null));
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    }
  }
);

const loginAction = createAsyncThunk<UserData, AuthData, ThunkApi & { rejectValue: string }>(
  'user/login',
  async ({ email, password }, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<{ token: string }>(APIRoute.Login, { email, password });
      saveToken(data.token);
      const { data: userData } = await api.get<UserData>(APIRoute.Login);
      dispatch(setUserData(userData));
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
      return userData;
    } catch {
      dropToken();
      dispatch(setUserData(null));
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
    dispatch(setUserData(null));
    dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
  }
);

const changeFavoriteStatusAction = createAsyncThunk<
  void,
  { offerId: string; status: 0 | 1 },
  ThunkApi
>('data/changeFavoriteStatus', async ({ offerId, status }, { dispatch, extra: api }) => {
  const { data } = await api.post<FavoriteDto>(`${APIRoute.Favorite}/${offerId}/${status}`);

  dispatch(
    setFavoriteStatus({
      offerId: String(data.id ?? offerId),
      isFavorite: Boolean(data.isFavorite),
    })
  );
});

const fetchOfferReviewsAction = createAsyncThunk<void, string, ThunkApi>(
  'data/fetchOfferReviews',
  async (offerId, { dispatch, extra: api }) => {
    const { data } = await api.get<Reviews>(`${APIRoute.Comments}/${offerId}`);
    dispatch(setOfferReviews(data));
  }
);

const fetchOfferDetailsAction = createAsyncThunk<
  void,
  string,
  ThunkApi & { rejectValue: number }
>('data/fetchOfferDetails', async (offerId, { dispatch, extra: api, rejectWithValue }) => {
  dispatch(setOfferDetailsLoadingStatus(true));
  dispatch(setCurrentOffer(null));
  dispatch(setOfferReviews([]));
  try {
    const [offerResponse, reviewsResponse] = await Promise.all([
      api.get<FullOffer>(`${APIRoute.Offers}/${offerId}`),
      api.get<Reviews>(`${APIRoute.Comments}/${offerId}`),
    ]);

    dispatch(setCurrentOffer(offerResponse.data));
    dispatch(setOfferReviews(reviewsResponse.data));
  } catch (error) {
    dispatch(setCurrentOffer(null));
    dispatch(setOfferReviews([]));

    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.status);
    }

    return rejectWithValue(500);
  } finally {
    dispatch(setOfferDetailsLoadingStatus(false));
  }
});

const postReviewAction = createAsyncThunk<
  void,
  { offerId: string; comment: string; rating: number },
  ThunkApi
>('data/postReview', async ({ offerId, comment, rating }, { dispatch, extra: api }) => {
  await api.post(`${APIRoute.Comments}/${offerId}`, { comment, rating });
  await dispatch(fetchOfferReviewsAction(offerId));
});

const clearErrorAction = createAsyncThunk<void, undefined, { dispatch: AppDispatch }>(
  'clearError',
  async (_arg, { dispatch }) => {
    setTimeout(() => dispatch(setError(null)), TIMEOUT_SHOW_ERROR);
  }
);

export {
  checkAuthAction,
  clearErrorAction,
  fetchOfferAction,
  fetchOfferDetailsAction,
  fetchOfferReviewsAction,
  loginAction,
  logoutAction,
  changeFavoriteStatusAction,
  postReviewAction,
};
