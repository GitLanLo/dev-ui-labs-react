import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CitiesCardList } from '../../components/cities-card-list/cities-card-list';
import { Logo } from '../../components/logo/logo';
import { Map } from '../../components/map/map';
import { CitiesList } from '../../components/cities-list/cities-list';
import { SortOptions } from '../../components/sort-options/sort-options';
import { FullOffer } from '../../types/offer';
import { RootState, AppDispatch } from '../../store';
import { AppRoute, CITIES_LOCATION, SortOffersType } from '../../const';
import { changeCity } from '../../store/action';
import { sortOffers } from '../../utils';
import { SortType } from '../../types/sort';
import { fetchOfferAction } from '../../store/api-actions';

function MainPage() {
  const dispatch = useDispatch<AppDispatch>();

  const currentCityName = useSelector((state: RootState) => state.cityName);
  const allOffers = useSelector((state: RootState) => state.offers);
  const favoritesCount = allOffers.filter((offer) => offer.isFavorite).length;

  const [selectedOffer, setSelectedOffer] = useState<FullOffer | null>(null);
  const [currentSortType, setCurrentSortType] = useState<SortType>(
    SortOffersType.Popular
  );

  const handleCardMouseEnter = (offer: FullOffer) => {
    setSelectedOffer(offer);
  };

  const handleCardMouseLeave = () => {
    setSelectedOffer(null);
  };

  const handleCityChange = (cityName: string) => {
    dispatch(changeCity(cityName));
    dispatch(fetchOfferAction());
    setSelectedOffer(null);
  };

  const handleSortChange = (sortType: SortType) => {
    setCurrentSortType(sortType);
  };

  const normalizedCurrentCityName = currentCityName.trim().toLowerCase();
  const filteredOffers = allOffers.filter(
    (offer) => offer.city.name.trim().toLowerCase() === normalizedCurrentCityName
  );

  const sortedOffers = sortOffers(filteredOffers, currentSortType);
  const city =
    CITIES_LOCATION.find((cityItem) => cityItem.name === currentCityName) ??
    CITIES_LOCATION[0];

  return (
    <div className="page page--gray page--main">
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
                      Oliver.conner@gmail.com
                    </span>
                    <span className="header__favorite-count">{favoritesCount}</span>
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

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>

        <div className="tabs">
          <section className="locations container">
            <CitiesList
              cities={CITIES_LOCATION}
              activeCityName={currentCityName}
              onCityChange={handleCityChange}
            />
          </section>
        </div>

        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {sortedOffers.length} places to stay in {currentCityName}
              </b>

              <SortOptions
                currentSortType={currentSortType}
                onChange={handleSortChange}
              />

              <div className="cities__places-list places__list tabs__content">
                <CitiesCardList
                  key={currentCityName}
                  offers={sortedOffers}
                  onCardMouseEnter={handleCardMouseEnter}
                  onCardMouseLeave={handleCardMouseLeave}
                />
              </div>
            </section>

            <div className="cities__right-section">
              <Map
                className="cities__map map"
                city={city}
                points={sortedOffers}
                selectedPoint={selectedOffer}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export { MainPage };
