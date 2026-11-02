# NetKâr v1.1

Static bilingual profit calculator. No external runtime dependencies. Open via a local HTTP server.

## Windows
In this folder run `py -m http.server 8000` then visit http://localhost:8000 .

## Tests
Install Node.js 22+, run `npm test` or `node --test tests/*.test.js`.

## Publishing
Upload **contents of this folder**, not the folder itself, to GitHub repository root and commit. Files with the same name should replace their predecessors. Keep your existing Google Search Console verification `.html` file (not included in this release); never delete it.

## Model
- With VAT disabled, legacy optional sales levy remains available.
- VAT-enabled: purchase and selling VAT are modeled separately; purchase input VAT is assumed recoverable; additional shipping/packaging/advertising/other costs are entered at full expense and never assumed to carry recoverable VAT.
- Price fields are VAT-inclusive or VAT-exclusive as selected independently. In VAT-exclusive sale mode, output VAT is added outside the quoted sale price and does not reduce profit.
- Commission on gross quoted sale or on VAT-exclusive sale as selected.
- Margin uses VAT-exclusive sale revenue when VAT is enabled.
- Other charges, marketplace commission VAT and tax settlement timing are not modeled. VAT difference is informative, not an added operating expense.
- All calculations are estimates; consult an accountant before using for tax declarations.
- Changing currency changes symbol, does not convert amounts. Product data stays in browser localStorage. No subscription/paywall is implemented.
