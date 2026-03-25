import { Link } from 'react-router-dom';
import { Header } from '../../components/header';
import { FavoriteCardList } from '../../components/favorite-card-list/favorite-card-list';
import { FullOffer, OffersList } from '../../types/offer';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeCity } from '../../store/action';
import { AppRoute } from '../../const';

type FavoritesByCity = Record<string, FullOffer[]>;

function groupFavoritesByCity(offers: OffersList): FavoritesByCity {
  return offers.reduce<FavoritesByCity>((acc, offer) => {
    const cityName = offer.city.name;

    if (!acc[cityName]) {
      acc[cityName] = [];
    }

    acc[cityName].push(offer);

    return acc;
  }, {});
}

function FavoritesPage() {
  const dispatch = useAppDispatch();
  const offers = useAppSelector((state) => state.offers);
  const favorites = offers.filter((offer) => offer.isFavorite);
  const favoritesByCity = groupFavoritesByCity(favorites);
  const cityEntries = Object.entries(favoritesByCity);
  const hasFavorites = favorites.length > 0;

  return (
    <div className={`page ${hasFavorites ? '' : 'page--favorites-empty'}`.trim()}>
      <Header />

      <main
        className={`page__main page__main--favorites ${
          hasFavorites ? '' : 'page__main--favorites-empty'
        }`.trim()}
      >
        <div className="page__favorites-container container">
          <section className={`favorites ${hasFavorites ? '' : 'favorites--empty'}`.trim()}>
            {hasFavorites ? (
              <>
                <h1 className="favorites__title">Saved listing</h1>
                <ul className="favorites__list">
                  {cityEntries.map(([cityName, offers]) => (
                    <li
                      className="favorites__locations-items"
                      key={cityName}
                    >
                      <div className="favorites__locations locations locations--current">
                        <div className="locations__item">
                          <Link
                            className="locations__item-link"
                            to={AppRoute.Main}
                            onClick={() => dispatch(changeCity(cityName))}
                          >
                            <span>{cityName}</span>
                          </Link>
                        </div>
                      </div>
                      <div className="favorites__places">
                        <FavoriteCardList offers={offers} />
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <h1 className="visually-hidden">Favorites (empty)</h1>
                <div className="favorites__status-wrapper">
                  <b className="favorites__status">Nothing yet saved.</b>
                  <p className="favorites__status-description">
                    Save properties to narrow down search or plan your future trips.
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <footer className={`footer ${hasFavorites ? 'container' : ''}`.trim()}>
        <Link className="footer__logo-link" to={AppRoute.Main}>
          <img
            className="footer__logo"
            src="/img/logo.svg"
            alt="Rent service logo"
            width="64"
            height="33"
          />
        </Link>
      </footer>
    </div>
  );
}

export { FavoritesPage };
