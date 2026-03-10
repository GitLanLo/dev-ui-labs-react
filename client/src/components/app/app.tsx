import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';
import { PrivateRoute } from '../private-route/private-route';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { LoadingPage } from '../loading-page';
import { checkAuthAction, fetchOfferAction } from '../../store/api-actions';

const MainPage = lazy(async () => {
  const module = await import('../../pages/main-page/main-page');
  return { default: module.MainPage };
});

const LoginPage = lazy(async () => {
  const module = await import('../../pages/login-page/login-page');
  return { default: module.LoginPage };
});

const FavoritesPage = lazy(async () => {
  const module = await import('../../pages/favorites-page/favorites-page');
  return { default: module.FavoritesPage };
});

const OfferPage = lazy(async () => {
  const module = await import('../../pages/offer-page/offer-page');
  return { default: module.OfferPage };
});

const NotFoundPage = lazy(async () => {
  const module = await import('../../pages/not-found-page/not-found-page');
  return { default: module.NotFoundPage };
});

function App() {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  const isOffersDataLoading = useAppSelector((state) => state.isOffersDataLoading);

  useEffect(() => {
    dispatch(checkAuthAction());
    dispatch(fetchOfferAction());
  }, [dispatch]);

  if (authorizationStatus === AuthorizationStatus.Unknown || isOffersDataLoading) {
    return <LoadingPage />;
  }

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path={AppRoute.Main} element={<MainPage />} />
          <Route path={AppRoute.Login} element={<LoginPage />} />
          <Route
            path={AppRoute.Favorites}
            element={
              <PrivateRoute authorizationStatus={authorizationStatus}>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
          <Route path={AppRoute.Offer} element={<OfferPage />} />
          <Route path={AppRoute.NotFound} element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export { App };
