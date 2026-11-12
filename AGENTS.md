# AGENTS.md

Static vanilla HTML/CSS/JS storefront ("Torgovchik", Russian-language vape shop). No build system, no package.json, no dependencies, no bundler. Deployed as-is to GitHub Pages (https://spodzh.github.io/torgovchik-shop/).

## Running & verifying

- No build/lint/typecheck step exists. Serve statically and open in a browser, e.g. `python -m http.server 8000` → http://localhost:8000. Don't rely on `file://` — pages fetch from the backend API.
- Tests are a browser page, not a test runner: open `tests.html`. It exercises only the pure functions in `js/utils.js` (`window.Utils`). If you change or add pure logic there, add matching test cases in `tests.html` and re-check its pass/fail counters.

## Structure facts that aren't obvious

- `index.html` loads only `js/utils.js` + `js/script.js`. `product.html` loads `js/utils.js` + `js/product.js`. `flappy.html` (secret game, reached by clicking the footer button 3×) is self-contained.
- The remaining files in `js/` — `cart.js`, `categories.js`, `filters.js`, `burger.js`, `toast.js`, `order-form.js`, `main.js` — are orphaned: no page loads them. Editing them has no effect; the live code is in `script.js` / `product.js`.
- Trap: orphaned files define the same symbols as live code (`switchCategory` in `categories.js`, filter/cart logic in `filters.js`/`cart.js`, `showToast` in `toast.js`). A grep hit in `js/` may be dead code — confirm which page loads the file before editing.
- `js/script.js` is a ~1600-line monolith containing cart, favorites, promocodes, auth, profile, orders, modals, filters, and categories. `js/product.js` duplicates parts of it (`WORKER_URL`, `showToast`, `initAgeGate`) — apply shared fixes to both.
- The backend is a Cloudflare Worker that is NOT in this repo. `WORKER_URL` is hardcoded in 3 places (`js/script.js:4`, `js/product.js:4`, `flappy.html:125`) — change all 3 together. Endpoints in use: `products`, `promocodes`, `product-stats`, `announcement`, `user/<telegram>`, `login`, `register`, `update-avatar`, `update-banner`, and `POST /` for order submission.
- Product data (ids, prices, images, brands) comes entirely from the worker API at runtime; there is no local product list.

## Gotchas

- Catalog/cart DOM is generated from template literals; generated buttons call globals via inline `onclick=` (`addToCart`, `changeQuantity`, `removeFromCart`, `manualRetry` in script.js). These functions must stay on the global scope — don't wrap script.js in an IIFE or ES module.
- Categories (`liquids`, `coils`, `snus`, `disposables`) are hardcoded in `index.html` (desktop nav + mobile menu) and in `switchCategory()` in script.js (liquids/snus get brand-filter UI; coils/disposables render a plain grid). Adding a category requires edits in both places.
- localStorage keys are cross-page contracts — don't rename: `torgovchik_cart`, `torgovchik_favorites`, `torgovchik_recently_viewed`, `torgovchik_age_verified`, `user_telegram`, `referralCode`, `announcement_seen_<version>`.
- The 18+ age gate must remain on every public page (legal requirement for this shop).

## Conventions

- All user-facing text and code comments are in Russian.
- BEM-style class names (`block__element--modifier`). CSS is split by component in `css/`; `index.html` loads them in a fixed order with `responsive.css` last — keep new styles in the matching file.
- For modals, use the helpers in script.js: `setupModal(modalId, onClose)` wires Esc/backdrop close, focus trap, and body scroll lock; `showModal`/`hideModal` toggle visibility via `open`/`show` classes, not inline styles.
