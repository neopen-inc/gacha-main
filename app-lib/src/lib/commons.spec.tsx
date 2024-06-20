import { render } from '@testing-library/react';

import Commons from './commons';

describe('Commons', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Commons />);
    expect(baseElement).toBeTruthy();
  });
});
