import { render } from '@testing-library/react';
import { StructuredData } from './StructuredData';

describe('StructuredData', () => {
  it('insère le JSON-LD, avec « < » échappé', () => {
    const { container } = render(<StructuredData data={{ '@type': 'Thing', name: '</script><b>' }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script?.innerHTML).toBe('{"@type":"Thing","name":"\\u003c/script>\\u003cb>"}');
    expect(JSON.parse(script?.textContent ?? '')).toEqual({ '@type': 'Thing', name: '</script><b>' });
  });
});
