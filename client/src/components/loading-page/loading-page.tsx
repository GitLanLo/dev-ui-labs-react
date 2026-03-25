import './loading-page.css';

function LoadingPage() {
  return (
    <div className="page page--gray page--main loading-page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <div className="header__logo-link header__logo-link--active">
                <img
                  className="header__logo"
                  src="/img/logo.svg"
                  alt="Rent service logo"
                  width="81"
                  height="41"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="page__main page__main--index">
        <div className="container loading-page__container">
          <div className="loading-page__spinner" aria-label="Loading"></div>
          <p className="loading-page__text">Loading ...</p>
        </div>
      </main>
    </div>
  );
}

export { LoadingPage };
