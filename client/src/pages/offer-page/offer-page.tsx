import { MouseEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Logo } from '../../components/logo/logo';
import { CommentForm } from '../../components/comment-form/comment-form';
import { ReviewsList } from '../../components/reviews-list/reviews-list';
import { Map } from '../../components/map/map';
import { NearPlacesList } from '../../components/near-places-list/near-places-list';
import { FullOffer } from '../../types/offer';
import { NewReview } from '../../types/review';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AppRoute, AuthorizationStatus } from '../../const';
import {
  changeFavoriteStatusAction,
  fetchOfferAction,
  fetchOfferDetailsAction,
  logoutAction,
  postReviewAction,
} from '../../store/api-actions';
import { LoadingPage } from '../../components/loading-page';

function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const offers = useAppSelector((state) => state.offers);
  const offer = useAppSelector((state) => state.currentOffer);
  const offerReviews = useAppSelector((state) => state.offerReviews);
  const isOfferDetailsLoading = useAppSelector((state) => state.isOfferDetailsLoading);
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  const userData = useAppSelector((state) => state.userData);
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;
  const favoritesCount = offers.filter((item) => item.isFavorite).length;
  const [selectedPoint, setSelectedPoint] = useState<FullOffer | null>(null);

  useEffect(() => {
    if (!offers.length) {
      dispatch(fetchOfferAction());
    }
  }, [dispatch, offers.length]);

  useEffect(() => {
    if (!id) {
      navigate(AppRoute.NotFound);
      return;
    }

    dispatch(fetchOfferDetailsAction(id))
      .unwrap()
      .catch(() => {
        navigate(AppRoute.NotFound);
      });
  }, [dispatch, id, navigate]);

  if (isOfferDetailsLoading || !offer || offer.id !== id) {
    return <LoadingPage />;
  }

  const ratingWidth = `${(offer.rating / 5) * 100}%`;

  const nearbyOffers = offers.filter(
    (item) => item.city.name === offer.city.name && item.id !== offer.id
  );

  const handleNearPlaceMouseEnter = (nearOffer: FullOffer) => {
    setSelectedPoint(nearOffer);
  };

  const handleNearPlaceMouseLeave = () => {
    setSelectedPoint(null);
  };

  const handleReviewSubmit = (review: NewReview) => {
    if (!id) {
      return;
    }

    dispatch(postReviewAction({ offerId: id, comment: review.comment, rating: review.rating }));
  };

  const handleFavoriteClick = () => {
    if (!isAuthorized) {
      navigate(AppRoute.Login);
      return;
    }

    dispatch(
      changeFavoriteStatusAction({
        offerId: offer.id,
        status: offer.isFavorite ? 0 : 1,
      })
    );
  };

  const handleLogoutClick = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    dispatch(logoutAction());
  };

  const mapSelectedPoint = selectedPoint ?? offer;

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Logo />
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  {authorizationStatus === AuthorizationStatus.Auth && userData ? (
                    <Link
                      className="header__nav-link header__nav-link--profile"
                      to={AppRoute.Favorites}
                    >
                      <div
                        className="header__avatar-wrapper user__avatar-wrapper"
                        style={{
                          backgroundImage: `url(${userData.avatar})`,
                          backgroundSize: 'cover',
                          borderRadius: '50%',
                        }}
                      ></div>
                      <span className="header__user-name user__name">{userData.email}</span>
                      <span className="header__favorite-count">{favoritesCount}</span>
                    </Link>
                  ) : (
                    <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Login}>
                      <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                      <span className="header__login">Sign in</span>
                    </Link>
                  )}
                </li>
                {authorizationStatus === AuthorizationStatus.Auth && (
                  <li className="header__nav-item">
                    <a className="header__nav-link" href="#" onClick={handleLogoutClick}>
                      <span className="header__signout">Sign out</span>
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer.images.slice(0, 6).map((image) => (
                <div className="offer__image-wrapper" key={image}>
                  <img className="offer__image" src={image} alt={offer.title} />
                </div>
              ))}
            </div>
          </div>

          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}

              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer.title}</h1>
                <button
                  className={`offer__bookmark-button button ${
                    isAuthorized && offer.isFavorite ? 'offer__bookmark-button--active' : ''
                  }`.trim()}
                  type="button"
                  onClick={handleFavoriteClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="/img/sprite.svg#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">
                    {isAuthorized && offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
                  </span>
                </button>
              </div>

              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: ratingWidth }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">
                  {offer.rating}
                </span>
              </div>

              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offer.bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offer.maxAdults} adults
                </li>
              </ul>

              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>

              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offer.goods.map((good) => (
                    <li className="offer__inside-item" key={good}>
                      {good}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div
                    className={`offer__avatar-wrapper user__avatar-wrapper ${
                      offer.host.isPro ? 'offer__avatar-wrapper--pro' : ''
                    }`}
                  >
                    <img
                      className="offer__avatar user__avatar"
                      src={offer.host.avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{offer.host.name}</span>
                  {offer.host.isPro && (
                    <span className="offer__user-status">Pro</span>
                  )}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{offer.description}</p>
                </div>
              </div>

              <section className="offer__reviews reviews">
                <ReviewsList reviews={offerReviews} />
                {isAuthorized && (
                  <CommentForm onSubmit={handleReviewSubmit} />
                )}
              </section>
            </div>
          </div>

          <Map
            className="offer__map map"
            city={offer.city}
            points={[offer, ...nearbyOffers]}
            selectedPoint={mapSelectedPoint}
          />
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <NearPlacesList
              offers={nearbyOffers}
              onCardMouseEnter={handleNearPlaceMouseEnter}
              onCardMouseLeave={handleNearPlaceMouseLeave}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export { OfferPage };
