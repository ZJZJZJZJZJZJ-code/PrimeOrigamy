# Amazon.de PartnerNet production state

Production URL: https://foldflightlab.github.io/

Tracking ID: `foldflightlab-21`

Commercial affiliate links are enabled. The site generates Amazon.de search URLs from tightly scoped category queries and appends the tracking ID. Links are marked as affiliate/commercial links and use `rel="sponsored nofollow noopener"`.

Required site disclosure:
`Als Amazon-Partner verdiene ich an qualifizierten Verkäufen.`

Operating guardrails:
- Do not use personal purchases to satisfy PartnerNet review requirements.
- Do not scrape or manually copy Amazon prices, customer reviews, ratings, stock status, or product images.
- Do not auto-redirect visitors to Amazon.
- Do not bid on Amazon trademarks in paid search.
- Keep the PartnerNet declared website URL synchronized with the production URL above.

## Official book-cover gate

Actual Amazon book-cover imagery remains blocked until the account is eligible for and registered with Amazon's authorized Creators API. Amazon's current documentation requires at least 10 qualifying sales in the preceding 30 days for PA API access through the Creators API.

When PartnerNet exposes the authorized route:

1. Register the application in Associates Central.
2. Keep credentials out of this public repository and GitHub Pages.
3. Request the configured ASINs with the authorized primary-image resource.
4. Add only the returned image URLs to the matching `config.js` book records.
5. Re-run validation and visually check title-to-cover matching before deployment.

Until then, do not scrape, screenshot, download, or manually copy Amazon product images. The site's original non-product cover treatments remain the compliant fallback.
