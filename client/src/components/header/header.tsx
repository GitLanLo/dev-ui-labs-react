import { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logoutAction } from '../../store/api-actions';
import { Logo } from '../logo/logo';

function Header() {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  const userData = useAppSelector((state) => state.userData);
  const favoritesCount = useAppSelector(
    (state) => state.offers.filter((offer) => offer.isFavorite).length
  );
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

  const handleLogoutClick = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    dispatch(logoutAction());
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Logo />
          </div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item user">
                {isAuthorized && userData ? (
                  <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Favorites}>
                    <div
                      className="header__avatar-wrapper user__avatar-wrapper"
                      style={{
                        backgroundImage: `url(${userData.avatar})`,
                        backgroundSize: 'cover',
                        borderRadius: '50%',
                      }}
                    ></div>
                    <span className="header__user-name user__name">{userData.email}</span>
                    <span className="header__favorite-count">{favoritesCount}</span>
                  </Link>
                ) : (
                  <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Login}>
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__login">Sign in</span>
                  </Link>
                )}
              </li>
              {isAuthorized && (
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#" onClick={handleLogoutClick}>
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export { Header };
