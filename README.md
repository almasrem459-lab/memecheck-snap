# MemeCheckShield MetaMask Snap

**Brand:** MemeCheckShield · **Live checker:** https://memecheck.pages.dev · **Main OSS:** https://github.com/almasrem459-lab/memecheck

Transaction-insights Snap that shows **Low / Medium / High / Extreme** meme-token risk with **plain-language reasons** inside MetaMask before you confirm a swap or approve.

Uses the same signals as the website for EVM: **GoPlus**, **Honeypot.is**, mint/tax/owner/LP/holder checks. Severity + reason ordering is shared with **Solana scans** via `risk-insight.js` on the main repo (`/api/snap-insight`).

> **MetaMask Grants apply form:** still **CLOSED** (Typeform TQ9ua2g2 as of 2026-10-20). This Snap is built so we are ready when intake reopens. Do not treat this repo as a submitted application.

License: **MIT**. Free / free-tier. Audit can be planned later (not claimed done).

## What it does

1. MetaMask calls `onTransaction` when you submit a tx.
2. Snap reads `chainId` + `to` + `data`, detects ERC-20 `approve` / `transfer` when present (flags **unlimited approve**).
3. Calls `GET https://memecheck.pages.dev/api/snap-insight?...`.
4. Renders severity + top reasons. On **Extreme** / critical, returns Flask `severity: "critical"` (modal warning).

Supported insight chains: **Ethereum, BNB Chain, Base, Arbitrum**. Solana remains primary on the website (same reason/severity formatter).

## Prerequisites

- [MetaMask Flask](https://metamask.io/flask/) (canary — required for local Snap install + critical severity)
- Node **18.6+** (20+ recommended)
- Yarn **3.2.1** (repo uses Yarn Berry; `yarn` via Corepack or `npm i -g yarn` then use the committed `.yarn`)

## Install & develop (local / Flask)

```bash
git clone https://github.com/almasrem459-lab/memecheck-snap.git
cd memecheck-snap
yarn install
yarn build:snap          # builds packages/snap/dist/bundle.js + updates shasum
yarn start               # Snap watch + companion site (Gatsby) on http://localhost:8000
```

In Chrome/Brave with **Flask** (disable stable MetaMask — they conflict):

1. Open http://localhost:8000
2. Click **Connect** → approve Snap permissions (transaction insights + network)
3. Send a test tx (Sepolia or a known token approve on a test account)
4. In the confirmation UI, open the **MemeCheckShield** insights tab

Serve Snap only:

```bash
yarn start:snap          # mm-snap watch on the Snap package
# or after build:
yarn workspace @memecheckshield/snap serve
```

Local Snap ID is typically `local:http://localhost:8080` (see mm-snap serve output).

## Demo without Flask on this machine

This environment has **no MetaMask Flask**. Demo artifacts:

| Artifact | Path / URL |
|---|---|
| Insight API (live) | https://memecheck.pages.dev/api/snap-insight?chain=base&ca=0x… |
| UI mock (panel layout) | `demo/insight-panel-mock.html` · screenshots under `demo/` |
| Install steps | this README |

Side-by-side: scan the same CA on https://memecheck.pages.dev — Solana and EVM use the shared insight formatter.

## Permissions (minimal)

```json
"endowment:transaction-insight": { "allowTransactionOrigin": true },
"endowment:network-access": {},
"endowment:rpc": { "dapps": true, "snaps": false },
"snap_dialog": {}
```

No key export, no arbitrary signing, no accounts permission.

## Package layout

```
packages/snap/          Snap source (onTransaction + status RPC)
packages/site/          Companion dapp for Flask install/test
demo/                   Screenshots / HTML mock (no Flask required)
docs/                   Extra notes
```

## Solana parity

Any new severity / reason logic added for the Snap lands in `risk-insight.js` on the main MemeCheckShield site and is shown on **Solana** (and EVM) scan results as the **Risk insight** card + `/api/snap-insight`.

## Publishing (later)

1. Publish `@memecheckshield/snap` to npm after audit plan
2. Submit to MetaMask Snaps directory when ready
3. Apply to MetaMask Grants when the form reopens — package ready, form not faked open

## Disclaimer

Not financial advice. Automated checks miss scams and can flag legit tokens. Always DYOR.
