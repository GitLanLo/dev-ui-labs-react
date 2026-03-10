import './loading-page.css';

function LoadingPage() {
  return (
    <div className="page page--gray page--main loading-page">
      <main className="page__main page__main--index">
        <div className="container loading-page__container">
          <div className="loading-page__spinner" aria-label="Loading"></div>
          <p className="loading-page__text">Loading...</p>
        </div>
      </main>
    </div>
  );
}

export { LoadingPage };
