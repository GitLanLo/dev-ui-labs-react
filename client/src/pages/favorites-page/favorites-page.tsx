import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/logo/logo';
import { FavoriteCardList } from '../../components/favorite-card-list/favorite-card-list';
import { FullOffer, OffersList } from '../../types/offer';
import { RootState, AppDispatch } from '../../store';
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
  const dispatch = useDispatch<AppDispatch>();
  const offers = useSelector((state: RootState) => state.offers);
  const favorites = offers.filter((offer) => offer.isFavorite);
  const favoritesByCity = groupFavoritesByCity(favorites);
  const cityEntries = Object.entries(favoritesByCity);
  const favoritesCount = favorites.length;

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
                  <Link
                    className="header__nav-link header__nav-link--profile"
                    to={AppRoute.Favorites}
                  >
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__user-name user__name">
                      Myemail@gmail.com
                    </span>
                    <span className="header__favorite-count">
                      {favoritesCount}
                    </span>
                  </Link>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
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
          </section>
        </div>
      </main>

      <footer className="footer container">
        <a className="footer__logo-link" href="main.html">
          <img
            className="footer__logo"
            src="/img/logo.svg"
            alt="Rent service logo"
            width="64"
            height="33"
          />
        </a>
      </footer>
    </div>
  );
}

export { FavoritesPage };
