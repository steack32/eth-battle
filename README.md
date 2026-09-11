# ETH Battle

Static client application: serve `dist/` from any HTTPS web server. No build or secrets required.

- Coinbase Exchange public ETH-USD ticker WebSocket, Kraken ETH/USD fallback.
- Each visitor connects directly to the exchange. Local network restrictions can prevent the feed.
- No synthetic price fallback. Feed stale after 15 s, reconnect with backoff and rotate providers after two unsuccessful attempts.
- `dist/market.js`: rolling 60-second price pressure; rolling absolute returns and five-minute baseline govern combat intensity.
- Canvas renderer: generated cutout units, projectiles, smoke, explosions, aircraft and front line. Responsive terrain; sound opt-in; reduced-motion control.
- `dist/assets/`: generated terrain and six extracted sprite assets.
- Graph begins at page open. No order book or liquidation data implied.

QA: syntax and asset references checked; market engine checked on flat/rising/falling/oscillating fixtures. Runtime smoke check with mock DOM and feed. Live WebSocket connection from build environment was unavailable; client has explicit connection state and reconnect handling. Browser visual QA not performed.
