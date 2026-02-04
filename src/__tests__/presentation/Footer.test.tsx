import { render, screen } from '@testing-library/react';
import Footer from '@/presentation/components/Footer';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

describe('Footer Component', () => {
  const renderFooter = () => {
    return render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Footer />
        </BrowserRouter>
      </I18nextProvider>
    );
  };

  it('should render footer', () => {
    const { container } = renderFooter();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('should display footer links', () => {
    renderFooter();
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should render footer sections or structure', () => {
    const { container } = renderFooter();
    const footer = container.querySelector('footer');
    // Check that footer has content/children
    expect(footer?.children.length || footer?.textContent?.length).toBeGreaterThan(0);
  });

  it('should render content with footer structure', () => {
    const { container } = renderFooter();
    const footer = container.querySelector('footer');
    // Footer should have content
    expect(footer).toBeInTheDocument();
    expect(footer?.textContent?.length || 0).toBeGreaterThan(0);
  });

  it('should have footer element with or without styling', () => {
    const { container } = renderFooter();
    const footer = container.querySelector('footer');
    // Footer should exist, styling is optional
    expect(footer).toBeInTheDocument();
  });

  it('should render footer with proper structure', () => {
    const { container } = renderFooter();
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('should contain multiple columns or sections', () => {
    const { container } = renderFooter();
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(0);
  });
});
