import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoute } from '../const';
import { LoadingPage } from '../components/loading-page/loading-page';
import { NotFoundPage } from '../pages/not-found-page/not-found-page';

const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

describe('LoadingPage', () => {
  it('renders loading text', () => {
    render(<LoadingPage />);

    expect(screen.getByText(/loading \.\.\./i)).toBeInTheDocument();
  });
});

describe('NotFoundPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter future={routerFutureConfig}>
        <NotFoundPage />
      </MemoryRouter>
    );

  it('renders PAGE NOT FOUND heading', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });

  it('renders a link to the main page', () => {
    renderPage();

    expect(screen.getByRole('link', { name: /перейдите на главную страницу/i })).toBeInTheDocument();
  });

  it('navigates to main page route', () => {
    renderPage();

    const link = screen.getByRole('link', { name: /перейдите на главную страницу/i });

    expect(link).toHaveAttribute('href', AppRoute.Main);
  });
});
