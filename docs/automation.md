# Automated Features Documentation

## Quotation Workflow
- Input SRS → Analyze → Price breakdown → Save request → Payment → Onboarding

## System Diagram (Text)
- Client → Quote Page
- Quote Page → SRS Analysis Library
- SRS Analysis → Pricing Engine
- Pricing → Summary → Storage (`iwq_requests`)
- Summary → Payment Page
- Payment Page → Status update (deposit/final) → Onboarding

## Upselling Logic
- Optional add-ons (QA, PM, Support) selectable in summary
- Final price = base + selected add-ons
- PDF export includes add-ons

## Bundling Algorithms (Examples)
- If realtime + mobile → suggest PM and QA bundle
- If admin + analytics → suggest support bundle
- Bundle pricing can be a percent discount off combined add-ons

