import { render, screen } from '@testing-library/react';
import Features from '@/presentation/components/Features';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

describe('Features Component', () => {
  const renderComponent = () => {
    return render(
      <I18nextProvider i18n={i18n}>
        <Features />
      </I18nextProvider>
    );
  };

  it('should render features section with all 4 feature cards', () => {
    renderComponent();
    const featureCards = screen.getAllByRole('button', { pressed: false });
    expect(featureCards).toHaveLength(4);
  });

  it('should render feature section with correct classes', () => {
    const { container } = renderComponent();
    const section = container.querySelector('.features-section');
    expect(section).toBeInTheDocument();
  });

  it('should render features grid with correct structure', () => {
    const { container } = renderComponent();
    const grid = container.querySelector('.features-grid');
    expect(grid).toBeInTheDocument();

    const items = container.querySelectorAll('.feature-item');
    expect(items).toHaveLength(4);
  });

  it('should have accessible button elements', () => {
    const { container } = renderComponent();
    const buttons = container.querySelectorAll('button[type="button"]');

    for (const button of buttons) {
      expect(button).toHaveAttribute('aria-pressed');
    }
  });

  it('should render feature icons', () => {
    const { container } = renderComponent();
    const icons = container.querySelectorAll('.feature-icon');
    expect(icons).toHaveLength(4);
    expect(icons[0].textContent).toBe('🚚');
    expect(icons[1].textContent).toBe('💰');
    expect(icons[2].textContent).toBe('💬');
    expect(icons[3].textContent).toBe('🔒');
  });

  it('should render feature titles and descriptions', () => {
    const { container } = renderComponent();

    const titles = container.querySelectorAll('.feature-title');
    const descriptions = container.querySelectorAll('.feature-desc');

    expect(titles).toHaveLength(4);
    expect(descriptions).toHaveLength(4);

    for (const title of titles) {
      expect(title.textContent).toBeTruthy();
    }

    for (const desc of descriptions) {
      expect(desc.textContent).toBeTruthy();
    }
  });
});
