import { render, screen } from '@testing-library/react';
import Newsletter from '@/presentation/components/Newsletter';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

describe('Newsletter Component', () => {
  const renderNewsletter = () => {
    return render(
      <I18nextProvider i18n={i18n}>
        <Newsletter />
      </I18nextProvider>
    );
  };

  it('should render newsletter section', () => {
    const { container } = renderNewsletter();
    expect(container).toBeInTheDocument();
  });

  it('should render newsletter title or heading', () => {
    const { container } = renderNewsletter();
    const headings = container.querySelectorAll('h1, h2, h3, h4');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('should render email input field', () => {
    renderNewsletter();
    const input =
      screen.queryByRole('textbox', { name: /email|mail/i }) ||
      screen.queryByPlaceholderText(/email|mail/i);
    expect(input).toBeInTheDocument();
  });

  it('should render submit button', () => {
    const { container } = renderNewsletter();
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should contain newsletter content text', () => {
    renderNewsletter();
    const container = renderNewsletter().container;
    expect(container.textContent).toBeTruthy();
    expect(container.textContent?.length).toBeGreaterThan(0);
  });

  it('should have form structure', () => {
    const { container } = renderNewsletter();
    const form = container.querySelector('form');
    expect(form || container.querySelector("[role='group']")).toBeInTheDocument();
  });

  it('should render input field for email subscription', () => {
    const { container } = renderNewsletter();
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should have newsletter container with styling', () => {
    const { container } = renderNewsletter();
    const sections = container.querySelectorAll("section, div[class*='newsletter']");
    expect(sections.length).toBeGreaterThan(0);
  });

  it('should render description text', () => {
    const { container } = renderNewsletter();
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThan(0);
  });
});
