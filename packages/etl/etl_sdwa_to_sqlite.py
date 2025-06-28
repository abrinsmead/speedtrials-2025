#!/usr/bin/env python3
"""
ETL tool to load SDWA CSV data into SQLite database
"""

import sqlite3
import csv
import os
import sys
from datetime import datetime
import logging
from pathlib import Path
import argparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SDWAETLProcessor:
    """ETL processor for SDWA data"""
    
    def __init__(self, data_dir: str, db_path: str):
        self.data_dir = Path(data_dir)
        self.db_path = db_path
        self.conn = None
        self.cursor = None
        
        # Define table schemas based on data model
        self.table_schemas = {
            'SDWA_PUB_WATER_SYSTEMS': """
                CREATE TABLE IF NOT EXISTS SDWA_PUB_WATER_SYSTEMS (
                    SUBMISSIONYEARQUARTER TEXT NOT NULL,
                    PWSID TEXT NOT NULL,
                    PWS_NAME TEXT,
                    PRIMACY_AGENCY_CODE TEXT,
                    EPA_REGION TEXT,
                    SEASON_BEGIN_DATE TEXT,
                    SEASON_END_DATE TEXT,
                    PWS_ACTIVITY_CODE TEXT,
                    PWS_DEACTIVATION_DATE TEXT,
                    PWS_TYPE_CODE TEXT,
                    DBPR_SCHEDULE_CAT_CODE TEXT,
                    CDS_ID TEXT,
                    GW_SW_CODE TEXT,
                    LT2_SCHEDULE_CAT_CODE TEXT,
                    OWNER_TYPE_CODE TEXT,
                    POPULATION_SERVED_COUNT INTEGER,
                    POP_CAT_2_CODE TEXT,
                    POP_CAT_3_CODE TEXT,
                    POP_CAT_4_CODE TEXT,
                    POP_CAT_5_CODE TEXT,
                    POP_CAT_11_CODE TEXT,
                    PRIMACY_TYPE TEXT,
                    PRIMARY_SOURCE_CODE TEXT,
                    IS_GRANT_ELIGIBLE_IND TEXT,
                    IS_WHOLESALER_IND TEXT,
                    IS_SCHOOL_OR_DAYCARE_IND TEXT,
                    SERVICE_CONNECTIONS_COUNT INTEGER,
                    SUBMISSION_STATUS_CODE TEXT,
                    ORG_NAME TEXT,
                    ADMIN_NAME TEXT,
                    EMAIL_ADDR TEXT,
                    PHONE_NUMBER TEXT,
                    PHONE_EXT_NUMBER TEXT,
                    FAX_NUMBER TEXT,
                    ALT_PHONE_NUMBER TEXT,
                    ADDRESS_LINE1 TEXT,
                    ADDRESS_LINE2 TEXT,
                    CITY_NAME TEXT,
                    ZIP_CODE TEXT,
                    COUNTRY_CODE TEXT,
                    FIRST_REPORTED_DATE TEXT,
                    LAST_REPORTED_DATE TEXT,
                    STATE_CODE TEXT,
                    SOURCE_WATER_PROTECTION_CODE TEXT,
                    SOURCE_PROTECTION_BEGIN_DATE TEXT,
                    OUTSTANDING_PERFORMER TEXT,
                    OUTSTANDING_PERFORM_BEGIN_DATE TEXT,
                    REDUCED_RTCR_MONITORING TEXT,
                    REDUCED_MONITORING_BEGIN_DATE TEXT,
                    REDUCED_MONITORING_END_DATE TEXT,
                    SEASONAL_STARTUP_SYSTEM TEXT,
                    PRIMARY KEY (SUBMISSIONYEARQUARTER, PWSID)
                )
            """,
            
            'SDWA_FACILITIES': """
                CREATE TABLE IF NOT EXISTS SDWA_FACILITIES (
                    SUBMISSIONYEARQUARTER TEXT NOT NULL,
                    PWSID TEXT NOT NULL,
                    FACILITY_ID TEXT NOT NULL,
                    FACILITY_NAME TEXT,
                    STATE_FACILITY_ID TEXT,
                    FACILITY_ACTIVITY_CODE TEXT,
                    FACILITY_DEACTIVATION_DATE TEXT,
                    FACILITY_TYPE_CODE TEXT,
                    SUBMISSION_STATUS_CODE TEXT,
                    IS_SOURCE_IND TEXT,
                    WATER_TYPE_CODE TEXT,
                    AVAILABILITY_CODE TEXT,
                    SELLER_TREATMENT_CODE TEXT,
                    SELLER_PWSID TEXT,
                    SELLER_PWS_NAME TEXT,
                    FILTRATION_STATUS_CODE TEXT,
                    IS_SOURCE_TREATED_IND TEXT,
                    FIRST_REPORTED_DATE TEXT,
                    LAST_REPORTED_DATE TEXT,
                    PRIMARY KEY (SUBMISSIONYEARQUARTER, PWSID, FACILITY_ID),
                    FOREIGN KEY (SUBMISSIONYEARQUARTER, PWSID) 
                        REFERENCES SDWA_PUB_WATER_SYSTEMS(SUBMISSIONYEARQUARTER, PWSID)
                )
            """,
            
            'SDWA_VIOLATIONS_ENFORCEMENT': """
                CREATE TABLE IF NOT EXISTS SDWA_VIOLATIONS_ENFORCEMENT (
                    SUBMISSIONYEARQUARTER TEXT NOT NULL,
                    PWSID TEXT NOT NULL,
                    VIOLATION_ID TEXT NOT NULL,
                    FACILITY_ID TEXT,
                    COMPL_PER_BEGIN_DATE TEXT,
                    COMPL_PER_END_DATE TEXT,
                    NON_COMPL_PER_BEGIN_DATE TEXT,
                    NON_COMPL_PER_END_DATE TEXT,
                    PWS_DEACTIVATION_DATE TEXT,
                    VIOLATION_CODE TEXT,
                    VIOLATION_CATEGORY_CODE TEXT,
                    IS_HEALTH_BASED_IND TEXT,
                    CONTAMINANT_CODE TEXT,
                    VIOL_MEASURE REAL,
                    UNIT_OF_MEASURE TEXT,
                    FEDERAL_MCL TEXT,
                    STATE_MCL REAL,
                    IS_MAJOR_VIOL_IND TEXT,
                    SEVERITY_IND_CNT INTEGER,
                    CALCULATED_RTC_DATE TEXT,
                    VIOLATION_STATUS TEXT,
                    PUBLIC_NOTIFICATION_TIER INTEGER,
                    CALCULATED_PUB_NOTIF_TIER INTEGER,
                    VIOL_ORIGINATOR_CODE TEXT,
                    SAMPLE_RESULT_ID TEXT,
                    CORRECTIVE_ACTION_ID TEXT,
                    RULE_CODE TEXT,
                    RULE_GROUP_CODE TEXT,
                    RULE_FAMILY_CODE TEXT,
                    VIOL_FIRST_REPORTED_DATE TEXT,
                    VIOL_LAST_REPORTED_DATE TEXT,
                    ENFORCEMENT_ID TEXT,
                    ENFORCEMENT_DATE TEXT,
                    ENFORCEMENT_ACTION_TYPE_CODE TEXT,
                    ENF_ACTION_CATEGORY TEXT,
                    ENF_ORIGINATOR_CODE TEXT,
                    ENF_FIRST_REPORTED_DATE TEXT,
                    ENF_LAST_REPORTED_DATE TEXT,
                    PRIMARY KEY (SUBMISSIONYEARQUARTER, PWSID, VIOLATION_ID),
                    FOREIGN KEY (SUBMISSIONYEARQUARTER, PWSID) 
                        REFERENCES SDWA_PUB_WATER_SYSTEMS(SUBMISSIONYEARQUARTER, PWSID)
                )
            """,
            
            'SDWA_LCR_SAMPLES': """
                CREATE TABLE IF NOT EXISTS SDWA_LCR_SAMPLES (
                    SUBMISSIONYEARQUARTER TEXT NOT NULL,
                    PWSID TEXT NOT NULL,
                    SAMPLE_ID TEXT NOT NULL,
                    SAMPLING_END_DATE TEXT,
                    SAMPLING_START_DATE TEXT,
                    RECONCILIATION_ID TEXT,
                    SAMPLE_FIRST_REPORTED_DATE TEXT,
                    SAMPLE_LAST_REPORTED_DATE TEXT,
                    SAR_ID INTEGER NOT NULL,
                    CONTAMINANT_CODE TEXT,
                    RESULT_SIGN_CODE TEXT,
                    SAMPLE_MEASURE REAL,
                    UNIT_OF_MEASURE TEXT,
                    SAR_FIRST_REPORTED_DATE TEXT,
                    SAR_LAST_REPORTED_DATE TEXT,
                    PRIMARY KEY (SUBMISSIONYEARQUARTER, PWSID, SAMPLE_ID, SAR_ID),
                    FOREIGN KEY (SUBMISSIONYEARQUARTER, PWSID) 
                        REFERENCES SDWA_PUB_WATER_SYSTEMS(SUBMISSIONYEARQUARTER, PWSID)
                )
            """,
            
            'SDWA_SITE_VISITS': """
                CREATE TABLE IF NOT EXISTS SDWA_SITE_VISITS (
                    SUBMISSIONYEARQUARTER TEXT NOT NULL,
                    PWSID TEXT NOT NULL,
                    VISIT_ID TEXT NOT NULL,
                    VISIT_DATE TEXT,
                    AGENCY_TYPE_CODE TEXT,
                    VISIT_REASON_CODE TEXT,
                    MANAGEMENT_OPS_EVAL_CODE TEXT,
                    SOURCE_WATER_EVAL_CODE TEXT,
                    SECURITY_EVAL_CODE TEXT,
                    PUMPS_EVAL_CODE TEXT,
                    OTHER_EVAL_CODE TEXT,
                    COMPLIANCE_EVAL_CODE TEXT,
                    DATA_VERIFICATION_EVAL_CODE TEXT,
                    TREATMENT_EVAL_CODE TEXT,
                    FINISHED_WATER_STOR_EVAL_CODE TEXT,
                    DISTRIBUTION_EVAL_CODE TEXT,
                    FINANCIAL_EVAL_CODE TEXT,
                    VISIT_COMMENTS TEXT,
                    FIRST_REPORTED_DATE TEXT,
                    LAST_REPORTED_DATE TEXT,
                    PRIMARY KEY (SUBMISSIONYEARQUARTER, PWSID, VISIT_ID),
                    FOREIGN KEY (SUBMISSIONYEARQUARTER, PWSID) 
                        REFERENCES SDWA_PUB_WATER_SYSTEMS(SUBMISSIONYEARQUARTER, PWSID)
                )
            """,
            
            'SDWA_GEOGRAPHIC_AREAS': """
                CREATE TABLE IF NOT EXISTS SDWA_GEOGRAPHIC_AREAS (
                    SUBMISSIONYEARQUARTER TEXT NOT NULL,
                    PWSID TEXT NOT NULL,
                    GEO_ID TEXT NOT NULL,
                    AREA_TYPE_CODE TEXT NOT NULL,
                    TRIBAL_CODE TEXT,
                    STATE_SERVED TEXT,
                    ANSI_ENTITY_CODE TEXT,
                    ZIP_CODE_SERVED TEXT,
                    CITY_SERVED TEXT,
                    COUNTY_SERVED TEXT,
                    LAST_REPORTED_DATE TEXT,
                    PRIMARY KEY (SUBMISSIONYEARQUARTER, PWSID, GEO_ID, AREA_TYPE_CODE),
                    FOREIGN KEY (SUBMISSIONYEARQUARTER, PWSID) 
                        REFERENCES SDWA_PUB_WATER_SYSTEMS(SUBMISSIONYEARQUARTER, PWSID)
                )
            """,
            
            'SDWA_SERVICE_AREAS': """
                CREATE TABLE IF NOT EXISTS SDWA_SERVICE_AREAS (
                    SUBMISSIONYEARQUARTER TEXT NOT NULL,
                    PWSID TEXT NOT NULL,
                    SERVICE_AREA_TYPE_CODE TEXT,
                    IS_PRIMARY_SERVICE_AREA_CODE TEXT,
                    FIRST_REPORTED_DATE TEXT,
                    LAST_REPORTED_DATE TEXT,
                    PRIMARY KEY (SUBMISSIONYEARQUARTER, PWSID),
                    FOREIGN KEY (SUBMISSIONYEARQUARTER, PWSID) 
                        REFERENCES SDWA_PUB_WATER_SYSTEMS(SUBMISSIONYEARQUARTER, PWSID)
                )
            """,
            
            'SDWA_EVENTS_MILESTONES': """
                CREATE TABLE IF NOT EXISTS SDWA_EVENTS_MILESTONES (
                    SUBMISSIONYEARQUARTER TEXT NOT NULL,
                    PWSID TEXT NOT NULL,
                    EVENT_SCHEDULE_ID TEXT NOT NULL,
                    EVENT_END_DATE TEXT,
                    EVENT_ACTUAL_DATE TEXT,
                    EVENT_COMMENTS_TEXT TEXT,
                    EVENT_MILESTONE_CODE TEXT,
                    EVENT_REASON_CODE TEXT,
                    FIRST_REPORTED_DATE TEXT,
                    LAST_REPORTED_DATE TEXT,
                    PRIMARY KEY (SUBMISSIONYEARQUARTER, PWSID, EVENT_SCHEDULE_ID),
                    FOREIGN KEY (SUBMISSIONYEARQUARTER, PWSID) 
                        REFERENCES SDWA_PUB_WATER_SYSTEMS(SUBMISSIONYEARQUARTER, PWSID)
                )
            """,
            
            'SDWA_PN_VIOLATION_ASSOC': """
                CREATE TABLE IF NOT EXISTS SDWA_PN_VIOLATION_ASSOC (
                    SUBMISSIONYEARQUARTER TEXT NOT NULL,
                    PWSID TEXT NOT NULL,
                    PN_VIOLATION_ID TEXT NOT NULL,
                    RELATED_VIOLATION_ID TEXT,
                    COMPL_PER_BEGIN_DATE TEXT,
                    COMPL_PER_END_DATE TEXT,
                    NON_COMPL_PER_BEGIN_DATE TEXT,
                    NON_COMPL_PER_END_DATE TEXT,
                    VIOLATION_CODE TEXT,
                    CONTAMINANT_CODE TEXT,
                    FIRST_REPORTED_DATE TEXT,
                    LAST_REPORTED_DATE TEXT,
                    PRIMARY KEY (SUBMISSIONYEARQUARTER, PWSID, PN_VIOLATION_ID),
                    FOREIGN KEY (SUBMISSIONYEARQUARTER, PWSID) 
                        REFERENCES SDWA_PUB_WATER_SYSTEMS(SUBMISSIONYEARQUARTER, PWSID)
                )
            """,
            
            'SDWA_REF_CODE_VALUES': """
                CREATE TABLE IF NOT EXISTS SDWA_REF_CODE_VALUES (
                    VALUE_TYPE TEXT NOT NULL,
                    VALUE_CODE TEXT NOT NULL,
                    VALUE_DESCRIPTION TEXT,
                    PRIMARY KEY (VALUE_TYPE, VALUE_CODE)
                )
            """
        }
        
        # Define indexes for performance
        self.indexes = [
            "CREATE INDEX IF NOT EXISTS idx_pws_activity ON SDWA_PUB_WATER_SYSTEMS(PWS_ACTIVITY_CODE)",
            "CREATE INDEX IF NOT EXISTS idx_pws_type ON SDWA_PUB_WATER_SYSTEMS(PWS_TYPE_CODE)",
            "CREATE INDEX IF NOT EXISTS idx_pws_state ON SDWA_PUB_WATER_SYSTEMS(STATE_CODE)",
            "CREATE INDEX IF NOT EXISTS idx_vio_status ON SDWA_VIOLATIONS_ENFORCEMENT(VIOLATION_STATUS)",
            "CREATE INDEX IF NOT EXISTS idx_vio_health ON SDWA_VIOLATIONS_ENFORCEMENT(IS_HEALTH_BASED_IND)",
            "CREATE INDEX IF NOT EXISTS idx_vio_dates ON SDWA_VIOLATIONS_ENFORCEMENT(NON_COMPL_PER_BEGIN_DATE, NON_COMPL_PER_END_DATE)",
            "CREATE INDEX IF NOT EXISTS idx_vio_contaminant ON SDWA_VIOLATIONS_ENFORCEMENT(CONTAMINANT_CODE)",
            "CREATE INDEX IF NOT EXISTS idx_fac_type ON SDWA_FACILITIES(FACILITY_TYPE_CODE)",
            "CREATE INDEX IF NOT EXISTS idx_fac_seller ON SDWA_FACILITIES(SELLER_PWSID)",
            "CREATE INDEX IF NOT EXISTS idx_lcr_contaminant ON SDWA_LCR_SAMPLES(CONTAMINANT_CODE)",
            "CREATE INDEX IF NOT EXISTS idx_lcr_dates ON SDWA_LCR_SAMPLES(SAMPLING_END_DATE)",
            "CREATE INDEX IF NOT EXISTS idx_visit_date ON SDWA_SITE_VISITS(VISIT_DATE)",
            "CREATE INDEX IF NOT EXISTS idx_geo_county ON SDWA_GEOGRAPHIC_AREAS(COUNTY_SERVED)",
            "CREATE INDEX IF NOT EXISTS idx_geo_city ON SDWA_GEOGRAPHIC_AREAS(CITY_SERVED)",
            "CREATE INDEX IF NOT EXISTS idx_geo_zip ON SDWA_GEOGRAPHIC_AREAS(ZIP_CODE_SERVED)",
            "CREATE INDEX IF NOT EXISTS idx_ref_type ON SDWA_REF_CODE_VALUES(VALUE_TYPE)"
        ]
        
    def connect_db(self):
        """Connect to SQLite database"""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.cursor = self.conn.cursor()
            # Enable foreign keys
            self.cursor.execute("PRAGMA foreign_keys = ON")
            logger.info(f"Connected to database: {self.db_path}")
        except sqlite3.Error as e:
            logger.error(f"Database connection failed: {e}")
            raise
            
    def close_db(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
            logger.info("Database connection closed")
            
    def create_schema(self):
        """Create database schema"""
        logger.info("Creating database schema...")
        
        try:
            # Create tables in correct order (reference table first)
            table_order = [
                'SDWA_REF_CODE_VALUES',
                'SDWA_PUB_WATER_SYSTEMS',
                'SDWA_FACILITIES',
                'SDWA_VIOLATIONS_ENFORCEMENT',
                'SDWA_LCR_SAMPLES',
                'SDWA_SITE_VISITS',
                'SDWA_GEOGRAPHIC_AREAS',
                'SDWA_SERVICE_AREAS',
                'SDWA_EVENTS_MILESTONES',
                'SDWA_PN_VIOLATION_ASSOC'
            ]
            
            for table_name in table_order:
                if table_name in self.table_schemas:
                    self.cursor.execute(self.table_schemas[table_name])
                    logger.info(f"Created table: {table_name}")
                    
            self.conn.commit()
            logger.info("Schema creation completed")
            
        except sqlite3.Error as e:
            logger.error(f"Schema creation failed: {e}")
            self.conn.rollback()
            raise
            
    def create_indexes(self):
        """Create database indexes"""
        logger.info("Creating indexes...")
        
        try:
            for index_sql in self.indexes:
                self.cursor.execute(index_sql)
                
            self.conn.commit()
            logger.info(f"Created {len(self.indexes)} indexes")
            
        except sqlite3.Error as e:
            logger.error(f"Index creation failed: {e}")
            self.conn.rollback()
            raise
            
    def load_csv_file(self, csv_file: Path, table_name: str):
        """Load a CSV file into a database table"""
        logger.info(f"Loading {csv_file.name} into {table_name}...")
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as f:
                csv_reader = csv.DictReader(f)
                
                # Get column names from CSV
                columns = csv_reader.fieldnames
                
                # Prepare insert statement
                placeholders = ','.join(['?' for _ in columns])
                insert_sql = f"INSERT OR REPLACE INTO {table_name} ({','.join(columns)}) VALUES ({placeholders})"
                
                # Track progress
                row_count = 0
                batch_size = 1000
                batch_data = []
                
                for row in csv_reader:
                    # Skip rows with missing primary key fields for violations table
                    if table_name == 'SDWA_VIOLATIONS_ENFORCEMENT' and not row.get('VIOLATION_ID'):
                        continue
                        
                    # Convert empty strings to None for proper NULL handling
                    row_values = [row[col] if row[col] != '' else None for col in columns]
                    batch_data.append(row_values)
                    
                    if len(batch_data) >= batch_size:
                        self.cursor.executemany(insert_sql, batch_data)
                        row_count += len(batch_data)
                        batch_data = []
                        
                        if row_count % 10000 == 0:
                            logger.info(f"  Processed {row_count:,} rows...")
                
                # Insert remaining rows
                if batch_data:
                    self.cursor.executemany(insert_sql, batch_data)
                    row_count += len(batch_data)
                
                self.conn.commit()
                logger.info(f"  Loaded {row_count:,} rows into {table_name}")
                
        except Exception as e:
            logger.error(f"Failed to load {csv_file.name}: {e}")
            self.conn.rollback()
            raise
            
    def validate_data(self):
        """Perform basic data validation"""
        logger.info("Validating loaded data...")
        
        validations = [
            ("SELECT COUNT(*) FROM SDWA_PUB_WATER_SYSTEMS", "Total water systems"),
            ("SELECT COUNT(*) FROM SDWA_VIOLATIONS_ENFORCEMENT", "Total violations"),
            ("SELECT COUNT(*) FROM SDWA_PUB_WATER_SYSTEMS WHERE PWS_ACTIVITY_CODE = 'A'", "Active water systems"),
            ("SELECT COUNT(DISTINCT PWSID) FROM SDWA_VIOLATIONS_ENFORCEMENT WHERE VIOLATION_STATUS = 'Unaddressed'", "Systems with unaddressed violations"),
            ("SELECT COUNT(*) FROM SDWA_REF_CODE_VALUES", "Reference code values")
        ]
        
        for sql, description in validations:
            self.cursor.execute(sql)
            count = self.cursor.fetchone()[0]
            logger.info(f"  {description}: {count:,}")
            
    def run_etl(self):
        """Run the complete ETL process"""
        start_time = datetime.now()
        logger.info(f"Starting ETL process at {start_time}")
        
        try:
            # Connect to database
            self.connect_db()
            
            # Create schema
            self.create_schema()
            
            # Load CSV files in correct order
            csv_files = [
                ('SDWA_REF_CODE_VALUES.csv', 'SDWA_REF_CODE_VALUES'),
                ('SDWA_PUB_WATER_SYSTEMS.csv', 'SDWA_PUB_WATER_SYSTEMS'),
                ('SDWA_FACILITIES.csv', 'SDWA_FACILITIES'),
                ('SDWA_VIOLATIONS_ENFORCEMENT.csv', 'SDWA_VIOLATIONS_ENFORCEMENT'),
                ('SDWA_LCR_SAMPLES.csv', 'SDWA_LCR_SAMPLES'),
                ('SDWA_SITE_VISITS.csv', 'SDWA_SITE_VISITS'),
                ('SDWA_GEOGRAPHIC_AREAS.csv', 'SDWA_GEOGRAPHIC_AREAS'),
                ('SDWA_SERVICE_AREAS.csv', 'SDWA_SERVICE_AREAS'),
                ('SDWA_EVENTS_MILESTONES.csv', 'SDWA_EVENTS_MILESTONES'),
                ('SDWA_PN_VIOLATION_ASSOC.csv', 'SDWA_PN_VIOLATION_ASSOC')
            ]
            
            for csv_filename, table_name in csv_files:
                csv_path = self.data_dir / csv_filename
                if csv_path.exists():
                    self.load_csv_file(csv_path, table_name)
                else:
                    logger.warning(f"CSV file not found: {csv_filename}")
                    
            # Create indexes
            self.create_indexes()
            
            # Validate data
            self.validate_data()
            
            # Calculate duration
            end_time = datetime.now()
            duration = end_time - start_time
            logger.info(f"ETL process completed in {duration}")
            
        except Exception as e:
            logger.error(f"ETL process failed: {e}")
            raise
            
        finally:
            self.close_db()
            

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Load SDWA CSV data into SQLite database')
    parser.add_argument('--data-dir', type=str, default='./data',
                        help='Directory containing CSV files (default: ./data)')
    parser.add_argument('--db-path', type=str, default='./sdwa_georgia.db',
                        help='Path to SQLite database file (default: ./sdwa_georgia.db)')
    parser.add_argument('--replace', action='store_true',
                        help='Replace existing database if it exists')
    
    args = parser.parse_args()
    
    # Check if data directory exists
    data_dir = Path(args.data_dir)
    if not data_dir.exists():
        logger.error(f"Data directory not found: {data_dir}")
        sys.exit(1)
        
    # Handle existing database
    db_path = Path(args.db_path)
    if db_path.exists():
        if args.replace:
            logger.info(f"Removing existing database: {db_path}")
            db_path.unlink()
        else:
            logger.warning(f"Database already exists: {db_path}")
            logger.warning("Use --replace flag to overwrite or specify a different path")
            sys.exit(1)
            
    # Run ETL
    processor = SDWAETLProcessor(str(data_dir), str(db_path))
    
    try:
        processor.run_etl()
        logger.info(f"Database created successfully: {db_path}")
        
    except Exception as e:
        logger.error(f"ETL failed: {e}")
        sys.exit(1)
        

if __name__ == "__main__":
    main()