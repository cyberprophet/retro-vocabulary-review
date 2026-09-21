# Retro Vocabulary M2 Review App

Fixed, data-free GitHub Pages app for the M2 human-review workflow. Reviewers select a privately delivered `m2-review-packet.json`; the browser reads it locally and exports `m2-review-result.json`.

The repository and Pages artifact must never contain generated packet/result files, M2 evidence, or candidate data. The app has no fetch/XHR, analytics, telemetry, external CDN, or other network dependency.
