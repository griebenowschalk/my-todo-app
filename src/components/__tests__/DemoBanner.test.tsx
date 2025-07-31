import { render, screen } from '@testing-library/react';
import { DemoBanner } from '../DemoBanner';

describe('DemoBanner', () => {
  it('renders the demo banner', () => {
    render(<DemoBanner />);

    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();

    const playgroundText = screen.getByText('Shared Playground');
    expect(playgroundText).toBeInTheDocument();
  });
});
