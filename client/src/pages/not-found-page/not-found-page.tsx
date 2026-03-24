import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';
import { Logo } from '../../components/logo/logo';

function NotFoundPage() {
  return (
    <div className="page page--gray page--not-found">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Logo />
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--not-found">
        <div className="container">
          <section className="not-found">
            <h1 className="not-found__title">PAGE NOT FOUND</h1>
            <p className="not-found__description">
              Sorry, the page you are looking for does not exist.
            </p>
            <Link className="not-found__link" to={AppRoute.Main}>
              Перейдите на главную страницу
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

export { NotFoundPage };
