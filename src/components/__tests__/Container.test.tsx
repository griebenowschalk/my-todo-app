import { render, screen } from '@testing-library/react';
import Container from '../Container';

describe('Container', () => {
  it('renders the container', () => {
    render(<Container />);
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
  });
});
