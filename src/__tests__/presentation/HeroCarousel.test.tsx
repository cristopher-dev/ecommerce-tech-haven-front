import { render, screen } from '@testing-library/react';
import HeroCarousel from '@/presentation/components/HeroCarousel';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

describe('HeroCarousel Component', () => {
  const renderWithI18n = (component: React.ReactElement) => {
    return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
  };

  it('should render hero carousel without crashing', () => {
    const { container } = renderWithI18n(<HeroCarousel />);
    expect(container).toBeInTheDocument();
  });

  it('should render carousel inner structure', () => {
    const { container } = renderWithI18n(<HeroCarousel />);
    const carouselInner = container.querySelector('.carousel-inner');
    expect(carouselInner).toBeInTheDocument();
  });

  it('should render active carousel item', () => {
    const { container } = renderWithI18n(<HeroCarousel />);
    const activeItem = container.querySelector('.carousel-item.active');
    expect(activeItem).toBeInTheDocument();
  });

  it('should render hero image', () => {
    const { container } = renderWithI18n(<HeroCarousel />);
    const images = container.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should have hero carousel ID', () => {
    const { container } = renderWithI18n(<HeroCarousel />);
    const carousel = container.querySelector('#heroCarousel');
    expect(carousel).toBeInTheDocument();
  });

  it('should have carousel slide class', () => {
    const { container } = renderWithI18n(<HeroCarousel />);
    const carousel = container.querySelector('.carousel.slide');
    expect(carousel).toBeInTheDocument();
  });

  it('should render multiple carousel items', () => {
    const { container } = renderWithI18n(<HeroCarousel />);
    const items = container.querySelectorAll('.carousel-item');
    expect(items.length).toBeGreaterThan(0);
  });

  it('should render navigation buttons', () => {
    const { container } = renderWithI18n(<HeroCarousel />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render carousel indicators or buttons for navigation', () => {
    const { container } = renderWithI18n(<HeroCarousel />);
    const indicators = container.querySelector('.carousel-indicators');
    const buttons = container.querySelectorAll('button');

    // Should have either indicators or navigation buttons
    expect(indicators || buttons.length > 0).toBeTruthy();
  });

  it('should have data-bs-ride attribute set to carousel', () => {
    const { container } = renderWithI18n(<HeroCarousel />);
    const carousel = container.querySelector('#heroCarousel') as HTMLElement;
    expect(carousel?.dataset.bsRide).toBe('carousel');
  });
});
