import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CitiesCardList } from '../../components/cities-card-list/cities-card-list';
import { Header } from '../../components/header';
import { Map } from '../../components/map/map';
import { CitiesList } from '../../components/cities-list/cities-list';
import { SortOptions } from '../../components/sort-options/sort-options';
import { FullOffer } from '../../types/offer';
import { RootState, AppDispatch } from '../../store';
import { CITIES_LOCATION, SortOffersType } from '../../const';
import { changeCity } from '../../store/action';
import { getOffersByCity, sortOffersByType } from '../../utils';
import { SortType } from '../../types/sort';

function MainPage() {
  const dispatch = useDispatch<AppDispatch>();

  const currentCityName = useSelector((state: RootState) => state.cityName);
  const allOffers = useSelector((state: RootState) => state.offers);

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
    setSelectedOffer(null);
  };

  const handleSortChange = (sortType: SortType) => {
    setCurrentSortType(sortType);
  };

  const filteredOffers = getOffersByCity(currentCityName, allOffers);
  const sortedOffers = sortOffersByType(filteredOffers, currentSortType);
  const hasOffers = sortedOffers.length > 0;
  const city =
    CITIES_LOCATION.find((cityItem) => cityItem.name === currentCityName) ??
    CITIES_LOCATION[0];

  return (
    <div className="page page--gray page--main">
      <Header />

      <main
        className={`page__main page__main--index ${
          hasOffers ? '' : 'page__main--index-empty'
        }`.trim()}
      >
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
          <div
            className={`cities__places-container ${
              hasOffers ? '' : 'cities__places-container--empty'
            } container`.trim()}
          >
            {hasOffers ? (
              <>
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
              </>
            ) : (
              <>
                <section className="cities__no-places">
                  <div className="cities__status-wrapper tabs__content">
                    <b className="cities__status">No places to stay available</b>
                    <p className="cities__status-description">
                      We could not find any property available at the moment in {currentCityName}
                    </p>
                  </div>
                </section>
                <div className="cities__right-section"></div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export { MainPage };
