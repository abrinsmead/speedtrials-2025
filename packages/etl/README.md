# SDWA ETL Package

This package contains the ETL (Extract, Transform, Load) tool for loading Safe Drinking Water Act (SDWA) data into a SQLite database.

## Overview

The ETL tool processes CSV files from the SDWA Information System and loads them into a normalized SQLite database with proper relationships, constraints, and indexes.

## Features

- Loads 10 SDWA CSV files into normalized database tables
- Handles data validation and skips invalid records
- Creates foreign key relationships between tables
- Adds performance indexes for common queries
- Provides progress tracking during data loading
- Supports command-line interface with options

## Usage

```bash
# From project root
python packages/etl/etl_sdwa_to_sqlite.py --data-dir ./data --db-path ./sdwa_georgia.db

# With options
python packages/etl/etl_sdwa_to_sqlite.py \
    --data-dir ./data \
    --db-path ./my_database.db \
    --replace  # Replace existing database
```

## Command Line Options

- `--data-dir`: Directory containing CSV files (default: ./data)
- `--db-path`: Path to SQLite database file (default: ./sdwa_georgia.db)
- `--replace`: Replace existing database if it exists

## Data Processing

### Tables Loaded (in order):
1. SDWA_REF_CODE_VALUES (reference/lookup data)
2. SDWA_PUB_WATER_SYSTEMS (main water systems)
3. SDWA_FACILITIES (water system facilities)
4. SDWA_VIOLATIONS_ENFORCEMENT (violations and enforcement)
5. SDWA_LCR_SAMPLES (lead and copper samples)
6. SDWA_SITE_VISITS (inspection visits)
7. SDWA_GEOGRAPHIC_AREAS (service areas)
8. SDWA_SERVICE_AREAS (service area types)
9. SDWA_EVENTS_MILESTONES (compliance milestones)
10. SDWA_PN_VIOLATION_ASSOC (public notifications)

### Data Validation

The ETL process includes validation:
- Skips rows with missing primary key values
- Converts empty strings to NULL values
- Validates foreign key relationships
- Reports summary statistics after loading

### Performance

- Batch processing (1000 records at a time)
- Progress indicators every 10,000 records
- Creates 16 indexes for optimal query performance
- Typical load time: ~2 seconds for complete dataset

## Requirements

- Python 3.6+
- sqlite3 (included with Python)
- No external dependencies required

## Output

Creates a SQLite database with:
- 10 normalized tables
- Foreign key constraints
- 16 performance indexes
- ~36MB for Georgia Q1 2025 data

## Error Handling

- Logs all operations with timestamps
- Rolls back transactions on errors
- Provides detailed error messages
- Validates data integrity after loading