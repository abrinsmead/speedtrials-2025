# Project Context for Claude

## Domain Terminology

### Site Visits
"Site visits" in this application refer to **physical inspections of water system facilities**, not website visits. These are compliance inspections where regulators visit water treatment plants, distribution systems, and other water infrastructure to evaluate:
- Management operations
- Source water quality
- Treatment processes
- Distribution system integrity
- Overall compliance
- Financial capacity

### Water Systems
Public Water Systems (PWS) are physical water utilities that provide drinking water to communities, not software systems. They include:
- **Community Water Systems (CWS)**: Serve the same population year-round
- **Non-Transient Non-Community Water Systems (NTNCWS)**: Serve at least 25 of the same people for 6+ months/year (e.g., schools, factories)
- **Transient Non-Community Water Systems (TNCWS)**: Serve transient populations (e.g., gas stations, campgrounds)

### PWSID
Public Water System Identification number - a unique identifier for each water system, not a password or security ID.

### Violations
Refers to regulatory compliance violations of the Safe Drinking Water Act (SDWA), not security breaches or system errors. Types include:
- Health-based violations (exceeding contaminant limits)
- Monitoring and reporting violations
- Public notification violations
- Treatment technique violations

## Technical Notes

### Database
The project uses a SQLite database (`sdwa_georgia.db`) containing Georgia's drinking water regulatory data from SDWIS (Safe Drinking Water Information System).

### Data Model
See `SDWA_Data_Model.md` for detailed schema information.

### Key Regulatory Concepts
See the Appendix in `WEB_SPEC.md` for comprehensive background on:
- SDWIS (federal and state versions)
- Primacy agencies
- Drinking water standards (MCLs, MCLGs, Treatment Techniques)
- Compliance and enforcement procedures

## Development Guidelines

### Testing Commands
When code changes are made, run:
```bash
npm run lint
npm run typecheck
```

### Project Structure
- `/packages/web` - Next.js web application
- Database queries use Drizzle ORM
- UI components use shadcn/ui
- Styling with Tailwind CSS

### Current Implementation Status
The project is in early development. Core features implemented:
- Database connection and schema
- Basic dashboard with violation statistics
- Water system search functionality
- Individual system detail pages
- Violation tracking and filtering