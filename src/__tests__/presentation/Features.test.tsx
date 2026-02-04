import { render } from '@testing-library/react';
import Features from '@/presentation/components/Features';

describe('Features Component', () => {
  it('should render features section', () => {
    const { container } = render(<Features />);
    expect(container).toBeInTheDocument();
  });
});
