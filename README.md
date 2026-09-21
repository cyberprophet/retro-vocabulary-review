# Retro Vocabulary M2 Review App

Fixed, data-free GitHub Pages app for the M2 human-review workflow. Reviewers select a privately delivered `m2-review-packet.json`; the browser reads it locally and exports `m2-review-result.json`.

The repository and Pages artifact must never contain generated packet/result files, M2 evidence, or candidate data. The app has no fetch/XHR, analytics, telemetry, external CDN, or other network dependency.

The app accepts only packets marked `m2-review-presentation-v1` and records that version in its exported result. A presentation or queue-order change requires a new version coordinated with the M2 run manifest and importer.
