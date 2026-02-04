import { render, screen, fireEvent } from '@testing-library/react';
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

  it('should cover social media hover effects', () => {
    renderFooter();
    const facebookButton = screen.getByLabelText('facebook');

    fireEvent.mouseEnter(facebookButton);
    expect(facebookButton.style.background).toBe('rgb(10, 102, 194)'); // #0A66C2 in RGB

    fireEvent.mouseLeave(facebookButton);
    expect(facebookButton.style.background).toBe('rgba(255, 255, 255, 0.08)');
  });

  it('should cover link hover state', () => {
    renderFooter();
    // Use a link that we know exists from i18n
    const contactUsLabel = i18n.t('footer.contactUs');
    const contactBtn = screen.getByText(new RegExp(contactUsLabel, 'i'));

    fireEvent.mouseEnter(contactBtn);
    fireEvent.mouseLeave(contactBtn);
  });

  it('should cover payment methods hover effects', () => {
    renderFooter();
    const visaBtn = screen.getByLabelText('Visa');

    fireEvent.mouseEnter(visaBtn);
    expect(visaBtn.style.background).toBe('rgba(0, 102, 255, 0.2)');

    fireEvent.mouseLeave(visaBtn);
    expect(visaBtn.style.background).toBe('rgba(255, 255, 255, 0.08)');
  });

  it('should cover privacy policy and terms hover effects', () => {
    renderFooter();
    const privacyBtn = screen.getByText(i18n.t('footer.privacyPolicy'));
    const termsBtn = screen.getByText(i18n.t('footer.termsOfService'));

    fireEvent.mouseEnter(privacyBtn);
    expect(privacyBtn.style.color).toBe('rgb(0, 102, 255)');

    fireEvent.mouseLeave(privacyBtn);
    expect(privacyBtn.style.color).toBe('rgb(176, 176, 176)'); // #b0b0b0

    fireEvent.mouseEnter(termsBtn);
    fireEvent.mouseLeave(termsBtn);
  });
});
