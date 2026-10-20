import type { OnTransactionHandler, OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { Box, Heading, Text, Bold, Divider, Link } from '@metamask/snaps-sdk/jsx';

const API = 'https://memecheck.pages.dev/api/snap-insight';

const CHAIN_MAP: Record<string, string> = {
  'eip155:1': 'ethereum',
  'eip155:56': 'bsc',
  'eip155:8453': 'base',
  'eip155:42161': 'arbitrum',
};

type InsightReason = {
  id: string;
  status: string;
  critical?: boolean;
  text: string;
  context?: boolean;
};

type Insight = {
  level: string;
  label: string;
  points: number;
  critical?: boolean;
  mmSeverity?: 'critical';
  reasons: InsightReason[];
  siteUrl?: string;
  methodologyUrl?: string;
  symbol?: string | null;
  ca?: string | null;
};

async function fetchInsight(params: Record<string, string>): Promise<Insight | null> {
  const q = new URLSearchParams(params);
  try {
    const res = await fetch(`${API}?${q.toString()}`, {
      method: 'GET',
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { insight?: Insight };
    return j.insight || null;
  } catch {
    return null;
  }
}

function mark(status: string, critical?: boolean): string {
  if (critical || status === 'fail') return 'FAIL';
  if (status === 'warn') return 'WARN';
  return status.toUpperCase();
}

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {
  const chain = CHAIN_MAP[chainId];
  if (!chain) {
    return {
      content: (
        <Box>
          <Heading>MemeCheckShield</Heading>
          <Text>
            Chain <Bold>{chainId}</Bold> is not supported yet (ETH / BSC / Base /
            Arbitrum).
          </Text>
          <Text>
            Open{' '}
            <Link href="https://memecheck.pages.dev">memecheck.pages.dev</Link>{' '}
            for Solana and other checks.
          </Text>
        </Box>
      ),
    };
  }

  const to = String(transaction.to || '');
  const data = String(transaction.data || '0x');
  const insight = await fetchInsight({
    chain,
    chainId,
    to,
    data,
    ca: to,
    ...(transactionOrigin ? { origin: transactionOrigin } : {}),
  });

  if (!insight) {
    return {
      content: (
        <Box>
          <Heading>MemeCheckShield</Heading>
          <Text>Could not reach the risk API. Try again or scan on the site.</Text>
          <Text>
            <Link href="https://memecheck.pages.dev">memecheck.pages.dev</Link>
          </Text>
        </Box>
      ),
    };
  }

  const title = insight.symbol
    ? `${insight.label} · $${insight.symbol}`
    : insight.label;
  const reasons = (insight.reasons || []).slice(0, 6);

  const body = (
    <Box>
      <Heading>MemeCheckShield</Heading>
      <Text>
        <Bold>{title}</Bold> ({insight.points} risk points)
      </Text>
      <Divider />
      {reasons.length === 0 ? (
        <Text>No major red flags from automated checks. Always DYOR.</Text>
      ) : (
        reasons.map((r) => (
          <Text>
            [{mark(r.status, r.critical)}] {r.text}
          </Text>
        ))
      )}
      <Divider />
      <Text>
        Method:{' '}
        <Link href={insight.methodologyUrl || 'https://memecheck.pages.dev/how'}>
          How the score works
        </Link>
      </Text>
      <Text>
        Full scan:{' '}
        <Link href={insight.siteUrl || 'https://memecheck.pages.dev'}>
          Open on MemeCheckShield
        </Link>
      </Text>
      <Text>Not financial advice. Free OSS checker — apply form still closed.</Text>
    </Box>
  );

  if (insight.mmSeverity === 'critical') {
    return { content: body, severity: 'critical' };
  }
  return { content: body };
};

/** Optional RPC for the companion dapp "hello / status" button. */
export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case 'status':
      return {
        name: 'MemeCheckShield',
        api: API,
        formStatus: 'closed',
        chains: ['ethereum', 'bsc', 'base', 'arbitrum'],
      };
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: (
            <Box>
              <Heading>MemeCheckShield Snap</Heading>
              <Text>
                Transaction insights are active. Confirm a swap or approve on ETH /
                BSC / Base / Arbitrum to see risk severity + reasons.
              </Text>
              <Text>
                MetaMask Grants apply Typeform is still closed — this Snap is ready
                for when it reopens.
              </Text>
            </Box>
          ),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
