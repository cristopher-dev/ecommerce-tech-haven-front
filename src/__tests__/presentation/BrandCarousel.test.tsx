import { render, screen } from '@testing-library/react';
import BrandCarousel from '@/presentation/components/BrandCarousel';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

describe('BrandCarousel Component', () => {
  it('should render brand carousel and display logos', () => {
    i18n.changeLanguage('en');
    render(
      <I18nextProvider i18n={i18n}>
        <BrandCarousel />
      </I18nextProvider>
    );

    expect(screen.getByText(/Our Brands/i)).toBeInTheDocument();

    // Check if logos are rendered (callback in map)
    const logos = screen.getAllByAltText(/Brand logo/i);
    expect(logos.length).toBeGreaterThan(0);
  });
});
