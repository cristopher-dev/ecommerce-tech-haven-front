import { render, screen } from '@testing-library/react';
import CategoryCarousel from '@/presentation/components/CategoryCarousel';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

describe('CategoryCarousel Component', () => {
  it('should render category carousel and display categories', () => {
    i18n.changeLanguage('en');
    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <CategoryCarousel />
        </BrowserRouter>
      </I18nextProvider>
    );

    expect(screen.getByText(/Shop by Category/i)).toBeInTheDocument();

    // Check if some categories are rendered (callback in map)
    const electronics = screen.getAllByText(/Electronics/i);
    expect(electronics.length).toBeGreaterThan(0);

    const gadgets = screen.getAllByText(/Gadgets/i);
    expect(gadgets.length).toBeGreaterThan(0);
  });
});
