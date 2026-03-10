import { FullOffer } from '../../types/offer';
import { useAppDispatch } from '../../hooks';
import { changeFavoriteStatusAction } from '../../store/api-actions';

type FavoriteCardProps = {
  offer: FullOffer;
};

function FavoriteCard({ offer }: FavoriteCardProps) {
  const ratingWidth = `${(offer.rating / 5) * 100}%`;
  const dispatch = useAppDispatch();

  return (
    <article className="favorites__card place-card">
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}

      <div className="favorites__image-wrapper place-card__image-wrapper">
        <a href="#">
          <img
            className="place-card__image"
            src={offer.images[0]}
            width="150"
            height="110"
            alt={offer.title}
          />
        </a>
      </div>

      <div className="favorites__card-info place-card__info">
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
            onClick={() =>
              dispatch(
                changeFavoriteStatusAction({
                  offerId: offer.id,
                  status: offer.isFavorite ? 0 : 1,
                })
              )
            }
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

export { FavoriteCard };
