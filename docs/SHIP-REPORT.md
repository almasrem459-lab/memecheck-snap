# MetaMask Snap work — report for Jojo (2026-10-20)

**Brand:** MemeCheckShield  
**Live:** https://memecheck.pages.dev  
**Preview:** https://snap-preview.memecheck.pages.dev  
**OSS (site):** https://github.com/almasrem459-lab/memecheck (`ddc9c83`)  
**Snap repo:** https://github.com/almasrem459-lab/memecheck-snap · local `/workspace/memecheck-snap`  
**Paper bots:** untouched  

## Done

1. **MetaMask Snap (transaction insights)** — real `onTransaction` handler, MIT, Flask-ready  
   - Permissions: `endowment:transaction-insight` (+ origin), `endowment:network-access`, minimal RPC/dialog  
   - Calls `GET /api/snap-insight` → severity Low/Med/High/Extreme + plain reasons  
   - Unlimited ERC-20 `approve` → critical Flask severity  
   - Builds: `yarn && yarn build:snap` (bundle OK, shasum fixed)

2. **Solana parity** — shared `risk-insight.js`  
   - Same top-reason ordering + severity labels  
   - **Risk insight** card on every scan (Solana + EVM)  
   - Pre-sign authority tip when mint/freeze fail (mirrors Snap approve caution)  
   - API works for Solana CAs too

3. **Docs / honesty**  
   - Apply Typeform still **CLOSED** — stated on Snap README, `/docs/SNAP.md`, `/how`, API `formStatus:"closed"`  
   - No fake submission  
   - Audit: planned later, not claimed

## URLs

| What | URL |
|---|---|
| Prod | https://memecheck.pages.dev |
| Preview | https://snap-preview.memecheck.pages.dev |
| Insight API | https://memecheck.pages.dev/api/snap-insight?chain=solana&ca=So111… |
| Snap GitHub | https://github.com/almasrem459-lab/memecheck-snap |
| How (Snap section) | https://memecheck.pages.dev/how#metamask-snap |

## Screenshots

- `/workspace/snap-insight-panel-mock.png` — MetaMask panel mock (no Flask on box)
- `/workspace/solana-insight-parity-mock.png` — Solana Risk insight card mock
- `/workspace/snap-solana-insight-live.png` — live site scan attempt
- Also under `/workspace/memecheck-snap/demo/`

## Gaps (honest)

- **No MetaMask Flask on this box** → no real wallet screen recording; HTML mock + API smoke instead  
- **GoPlus** often rate-limits Cloudflare egress → Snap API may lean on Honeypot.is / partial data (site browser path re-fetches GoPlus from user IP — Snap does not yet)  
- Snap **not** on npm directory yet; local/Flask install only  
- **Audit** not started  
- GitHub Actions removed from Snap repo (token lacks `workflow` scope)

## Levantine-ready bullets (for Jojo)

- بلشنا Snap حقيقي: transaction insights قبل التوقيع (شدة + أسباب بالإنجليزي)
- الريبو: github.com/almasrem459-lab/memecheck-snap (MIT) + مربوط من الموقع و /how
- أي منطق أسباب/severity جديد طالع كمان على **سولانا** (بطاقة Risk insight + نفس الـ API)
- فورم المنحة لسا **مسكّر** — ما قدّمنا شي؛ جاهزين لما يفتح
- Flask محلي للتجربة؛ هون ما في Flask فعملنا mock + API
- GoPlus من سيرفر Cloudflare أحياناً ينحظر — موثّق؛ الأوديت لاحقاً
