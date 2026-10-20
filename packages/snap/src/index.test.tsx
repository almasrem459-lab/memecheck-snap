import { expect } from '@jest/globals';
import { installSnap } from '@metamask/snaps-jest';

describe('MemeCheckShield Snap', () => {
  it('exposes onTransaction handler', async () => {
    const { onTransaction } = await import('./index');
    expect(typeof onTransaction).toBe('function');
  });

  it('responds to status rpc', async () => {
    const { request } = await installSnap();
    const response = await request({ method: 'status' });
    expect(response).toRespondWith({
      name: 'MemeCheckShield',
      api: 'https://memecheck.pages.dev/api/snap-insight',
      formStatus: 'closed',
      chains: ['ethereum', 'bsc', 'base', 'arbitrum'],
    });
  });
});
