# Dynamic Pricing Functionality

## Real-time Adjustments
- Uses predefined rate structures per experience level (Junior, Mid, Senior/Agency)
- Complexity points are computed from SRS content; hours estimated as points × 3
- Base price = hours × hourly rate × level multiplier

## Rate Structure
- Junior: $40/hr × 1.0
- Mid-level: $60/hr × 1.2
- Senior/Agency: $100/hr × 1.4

## Pricing Matrix (Example)
- Indicator → Points → Cost Contribution
- Payments → 8 → points × per-point value
- Custom API → 6 → points × per-point value
- Realtime → 7 → points × per-point value
- Admin → 5 → points × per-point value
- Mobile → 9 → points × per-point value

## Calculation Methodology
- Normalize text; detect indicators with keyword patterns
- Sum points; minimum baseline of 2
- Estimate hours; apply rates; derive per-point value = base / total points
- Breakdown shown as driver label + allocated cost

## Visual Example (Mid-level)
- Total points: 20 → hours: 60
- Base: 60 × $60 × 1.2 = $4,320
- Per-point: $216
- Payments (8): $1,728; API (6): $1,296; Admin (5): $1,080; Realtime (7): $1,512; Mobile (9): $1,944

