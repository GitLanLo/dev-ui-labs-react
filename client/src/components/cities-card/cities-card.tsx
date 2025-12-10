import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppRoute } from '../../const';
import { FullOffer } from '../../types/offer';
import { toggleFavorite } from '../../store/action';
import { AppDispatch } from '../../store';

type CitiesCardProps = {
  offer: FullOffer;
  onMouseEnter?: (offer: FullOffer) => void;
  onMouseLeave?: () => void;
};

function CitiesCard({ offer, onMouseEnter, onMouseLeave }: CitiesCardProps) {
  const ratingWidth = `${(offer.rating / 5) * 100}%`;
  const dispatch = useDispatch<AppDispatch>();

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

  return (
    <article
      className="cities__card place-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className="cities__image-wrapper place-card__image-wrapper">
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
              offer.isFavorite ? 'place-card__bookmark-button--active' : ''
            }`.trim()}
            type="button"
            onClick={() => dispatch(toggleFavorite(offer.id))}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="/img/sprite.svg#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">
              {offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
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
          <a href="#">{offer.title}</a>
        </h2>
        <p className="place-card__type">
          {offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}
        </p>
      </div>
    </article>
  );
}

export { CitiesCard };
