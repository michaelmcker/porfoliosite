# Portfolio media release — October 12, 2026

Release: `4c990a8`, GitHub main to existing Vercel project.

- Three shareable video pages: `/work/st-james-school/`, `/work/ai-catalyst/`, `/work/vertical-impression/`.
- St. James school website links: `https://sjslegacy.com/`.
- Upon This Rock video/player/schema removed; website and artwork retained. Retired film/poster are excluded from deployment and return 404.
- Actual full-HD scrolling story replaces low-resolution GIF; transparent RCCV laptop cleaned and shadow softened.
- Original source assets preserved privately or in repository.

## Verification

169 tests pass; one pre-existing About browser test fails because configured Chrome executable is absent. Native connected-browser review covers mobile, tablet and desktop plus playback.

Seventeen public files match local release exactly; three Markdown negotiations return correct source; three MP4 range requests return 206 and correct bytes. Live St. James native playback and marketing story verified. Live film/mobile/marketing layout has no overflow.

Vercel deployment metadata endpoint returned scope 403 and CLI is absent. Public production responses independently verify the release; no deployment READY state is claimed.

Private captures, originals and response evidence: `/Users/michaelmckerracher/Business Research/portfolio-media-2026-10-12/`.
