import { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FullOffer } from '../../types/offer';
import { AppRoute, AuthorizationStatus } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeFavoriteStatusAction } from '../../store/api-actions';

type NearPlacesCardProps = {
  offer: FullOffer;
  onMouseEnter?: (offer: FullOffer) => void;
  onMouseLeave?: () => void;
};

function NearPlacesCard({ offer, onMouseEnter, onMouseLeave }: NearPlacesCardProps) {
  const ratingWidth = `${(offer.rating / 5) * 100}%`;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;
  const isFavoriteActive = isAuthorized && offer.isFavorite;

  const handleMouseEnter = () => {
    if (onMouseEnter) {
      onMouseEnter(offer);
    }
  };

  const handleMouseLeave = () => {
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  const handleBookmarkClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

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

  return (
    <article
      className="near-places__card place-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}

      <div className="near-places__image-wrapper place-card__image-wrapper">
        <Link to={AppRoute.Offer.replace(':id', offer.id)}>
          <img
            className="place-card__image"
            src={offer.images[0]}
            width="260"
            height="200"
            alt={offer.title}
          />
        </Link>
      </div>

      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button button ${
              isFavoriteActive ? 'place-card__bookmark-button--active' : ''
            }`.trim()}
            type="button"
            onClick={handleBookmarkClick}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="/img/sprite.svg#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">
              {isFavoriteActive ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>

        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: ratingWidth }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>

        <h2 className="place-card__name">
          <Link to={AppRoute.Offer.replace(':id', offer.id)}>{offer.title}</Link>
        </h2>

        <p className="place-card__type">
          {offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}
        </p>
      </div>
    </article>
  );
}

export { NearPlacesCard };
