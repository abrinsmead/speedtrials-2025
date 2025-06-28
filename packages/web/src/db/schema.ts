import { sqliteTable, text, integer, real, primaryKey, foreignKey } from 'drizzle-orm/sqlite-core';

// Reference/Lookup table
export const refCodeValues = sqliteTable(
  'SDWA_REF_CODE_VALUES',
  {
    valueType: text('VALUE_TYPE').notNull(),
    valueCode: text('VALUE_CODE').notNull(),
    valueDescription: text('VALUE_DESCRIPTION'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.valueType, table.valueCode] }),
  })
);

// Main public water systems table
export const pubWaterSystems = sqliteTable(
  'SDWA_PUB_WATER_SYSTEMS',
  {
    submissionYearQuarter: text('SUBMISSIONYEARQUARTER').notNull(),
    pwsid: text('PWSID').notNull(),
    pwsName: text('PWS_NAME'),
    primacyAgencyCode: text('PRIMACY_AGENCY_CODE'),
    epaRegion: text('EPA_REGION'),
    seasonBeginDate: text('SEASON_BEGIN_DATE'),
    seasonEndDate: text('SEASON_END_DATE'),
    pwsActivityCode: text('PWS_ACTIVITY_CODE'),
    pwsDeactivationDate: text('PWS_DEACTIVATION_DATE'),
    pwsTypeCode: text('PWS_TYPE_CODE'),
    dbprScheduleCatCode: text('DBPR_SCHEDULE_CAT_CODE'),
    cdsId: text('CDS_ID'),
    gwSwCode: text('GW_SW_CODE'),
    lt2ScheduleCatCode: text('LT2_SCHEDULE_CAT_CODE'),
    ownerTypeCode: text('OWNER_TYPE_CODE'),
    populationServedCount: integer('POPULATION_SERVED_COUNT'),
    popCat2Code: text('POP_CAT_2_CODE'),
    popCat3Code: text('POP_CAT_3_CODE'),
    popCat4Code: text('POP_CAT_4_CODE'),
    popCat5Code: text('POP_CAT_5_CODE'),
    popCat11Code: text('POP_CAT_11_CODE'),
    primacyType: text('PRIMACY_TYPE'),
    primarySourceCode: text('PRIMARY_SOURCE_CODE'),
    isGrantEligibleInd: text('IS_GRANT_ELIGIBLE_IND'),
    isWholesalerInd: text('IS_WHOLESALER_IND'),
    isSchoolOrDaycareInd: text('IS_SCHOOL_OR_DAYCARE_IND'),
    serviceConnectionsCount: integer('SERVICE_CONNECTIONS_COUNT'),
    submissionStatusCode: text('SUBMISSION_STATUS_CODE'),
    orgName: text('ORG_NAME'),
    adminName: text('ADMIN_NAME'),
    emailAddr: text('EMAIL_ADDR'),
    phoneNumber: text('PHONE_NUMBER'),
    phoneExtNumber: text('PHONE_EXT_NUMBER'),
    faxNumber: text('FAX_NUMBER'),
    altPhoneNumber: text('ALT_PHONE_NUMBER'),
    addressLine1: text('ADDRESS_LINE1'),
    addressLine2: text('ADDRESS_LINE2'),
    cityName: text('CITY_NAME'),
    zipCode: text('ZIP_CODE'),
    countryCode: text('COUNTRY_CODE'),
    firstReportedDate: text('FIRST_REPORTED_DATE'),
    lastReportedDate: text('LAST_REPORTED_DATE'),
    stateCode: text('STATE_CODE'),
    sourceWaterProtectionCode: text('SOURCE_WATER_PROTECTION_CODE'),
    sourceProtectionBeginDate: text('SOURCE_PROTECTION_BEGIN_DATE'),
    outstandingPerformer: text('OUTSTANDING_PERFORMER'),
    outstandingPerformBeginDate: text('OUTSTANDING_PERFORM_BEGIN_DATE'),
    reducedRtcrMonitoring: text('REDUCED_RTCR_MONITORING'),
    reducedMonitoringBeginDate: text('REDUCED_MONITORING_BEGIN_DATE'),
    reducedMonitoringEndDate: text('REDUCED_MONITORING_END_DATE'),
    seasonalStartupSystem: text('SEASONAL_STARTUP_SYSTEM'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.submissionYearQuarter, table.pwsid] }),
  })
);

// Facilities table
export const facilities = sqliteTable(
  'SDWA_FACILITIES',
  {
    submissionYearQuarter: text('SUBMISSIONYEARQUARTER').notNull(),
    pwsid: text('PWSID').notNull(),
    facilityId: text('FACILITY_ID').notNull(),
    facilityName: text('FACILITY_NAME'),
    stateFacilityId: text('STATE_FACILITY_ID'),
    facilityActivityCode: text('FACILITY_ACTIVITY_CODE'),
    facilityDeactivationDate: text('FACILITY_DEACTIVATION_DATE'),
    facilityTypeCode: text('FACILITY_TYPE_CODE'),
    submissionStatusCode: text('SUBMISSION_STATUS_CODE'),
    isSourceInd: text('IS_SOURCE_IND'),
    waterTypeCode: text('WATER_TYPE_CODE'),
    availabilityCode: text('AVAILABILITY_CODE'),
    sellerTreatmentCode: text('SELLER_TREATMENT_CODE'),
    sellerPwsid: text('SELLER_PWSID'),
    sellerPwsName: text('SELLER_PWS_NAME'),
    filtrationStatusCode: text('FILTRATION_STATUS_CODE'),
    isSourceTreatedInd: text('IS_SOURCE_TREATED_IND'),
    firstReportedDate: text('FIRST_REPORTED_DATE'),
    lastReportedDate: text('LAST_REPORTED_DATE'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.submissionYearQuarter, table.pwsid, table.facilityId] }),
    fkPws: foreignKey({
      columns: [table.submissionYearQuarter, table.pwsid],
      foreignColumns: [pubWaterSystems.submissionYearQuarter, pubWaterSystems.pwsid],
    }),
  })
);

// Violations and Enforcement table
export const violationsEnforcement = sqliteTable(
  'SDWA_VIOLATIONS_ENFORCEMENT',
  {
    submissionYearQuarter: text('SUBMISSIONYEARQUARTER').notNull(),
    pwsid: text('PWSID').notNull(),
    violationId: text('VIOLATION_ID').notNull(),
    facilityId: text('FACILITY_ID'),
    complPerBeginDate: text('COMPL_PER_BEGIN_DATE'),
    complPerEndDate: text('COMPL_PER_END_DATE'),
    nonComplPerBeginDate: text('NON_COMPL_PER_BEGIN_DATE'),
    nonComplPerEndDate: text('NON_COMPL_PER_END_DATE'),
    pwsDeactivationDate: text('PWS_DEACTIVATION_DATE'),
    violationCode: text('VIOLATION_CODE'),
    violationCategoryCode: text('VIOLATION_CATEGORY_CODE'),
    isHealthBasedInd: text('IS_HEALTH_BASED_IND'),
    contaminantCode: text('CONTAMINANT_CODE'),
    violMeasure: real('VIOL_MEASURE'),
    unitOfMeasure: text('UNIT_OF_MEASURE'),
    federalMcl: text('FEDERAL_MCL'),
    stateMcl: real('STATE_MCL'),
    isMajorViolInd: text('IS_MAJOR_VIOL_IND'),
    severityIndCnt: integer('SEVERITY_IND_CNT'),
    calculatedRtcDate: text('CALCULATED_RTC_DATE'),
    violationStatus: text('VIOLATION_STATUS'),
    publicNotificationTier: integer('PUBLIC_NOTIFICATION_TIER'),
    calculatedPubNotifTier: integer('CALCULATED_PUB_NOTIF_TIER'),
    violOriginatorCode: text('VIOL_ORIGINATOR_CODE'),
    sampleResultId: text('SAMPLE_RESULT_ID'),
    correctiveActionId: text('CORRECTIVE_ACTION_ID'),
    ruleCode: text('RULE_CODE'),
    ruleGroupCode: text('RULE_GROUP_CODE'),
    ruleFamilyCode: text('RULE_FAMILY_CODE'),
    violFirstReportedDate: text('VIOL_FIRST_REPORTED_DATE'),
    violLastReportedDate: text('VIOL_LAST_REPORTED_DATE'),
    enforcementId: text('ENFORCEMENT_ID'),
    enforcementDate: text('ENFORCEMENT_DATE'),
    enforcementActionTypeCode: text('ENFORCEMENT_ACTION_TYPE_CODE'),
    enfActionCategory: text('ENF_ACTION_CATEGORY'),
    enfOriginatorCode: text('ENF_ORIGINATOR_CODE'),
    enfFirstReportedDate: text('ENF_FIRST_REPORTED_DATE'),
    enfLastReportedDate: text('ENF_LAST_REPORTED_DATE'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.submissionYearQuarter, table.pwsid, table.violationId] }),
    fkPws: foreignKey({
      columns: [table.submissionYearQuarter, table.pwsid],
      foreignColumns: [pubWaterSystems.submissionYearQuarter, pubWaterSystems.pwsid],
    }),
  })
);

// Lead and Copper Rule Samples
export const lcrSamples = sqliteTable(
  'SDWA_LCR_SAMPLES',
  {
    submissionYearQuarter: text('SUBMISSIONYEARQUARTER').notNull(),
    pwsid: text('PWSID').notNull(),
    sampleId: text('SAMPLE_ID').notNull(),
    samplingEndDate: text('SAMPLING_END_DATE'),
    samplingStartDate: text('SAMPLING_START_DATE'),
    reconciliationId: text('RECONCILIATION_ID'),
    sampleFirstReportedDate: text('SAMPLE_FIRST_REPORTED_DATE'),
    sampleLastReportedDate: text('SAMPLE_LAST_REPORTED_DATE'),
    sarId: integer('SAR_ID').notNull(),
    contaminantCode: text('CONTAMINANT_CODE'),
    resultSignCode: text('RESULT_SIGN_CODE'),
    sampleMeasure: real('SAMPLE_MEASURE'),
    unitOfMeasure: text('UNIT_OF_MEASURE'),
    sarFirstReportedDate: text('SAR_FIRST_REPORTED_DATE'),
    sarLastReportedDate: text('SAR_LAST_REPORTED_DATE'),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.submissionYearQuarter, table.pwsid, table.sampleId, table.sarId],
    }),
    fkPws: foreignKey({
      columns: [table.submissionYearQuarter, table.pwsid],
      foreignColumns: [pubWaterSystems.submissionYearQuarter, pubWaterSystems.pwsid],
    }),
  })
);

// Site Visits
export const siteVisits = sqliteTable(
  'SDWA_SITE_VISITS',
  {
    submissionYearQuarter: text('SUBMISSIONYEARQUARTER').notNull(),
    pwsid: text('PWSID').notNull(),
    visitId: text('VISIT_ID').notNull(),
    visitDate: text('VISIT_DATE'),
    agencyTypeCode: text('AGENCY_TYPE_CODE'),
    visitReasonCode: text('VISIT_REASON_CODE'),
    managementOpsEvalCode: text('MANAGEMENT_OPS_EVAL_CODE'),
    sourceWaterEvalCode: text('SOURCE_WATER_EVAL_CODE'),
    securityEvalCode: text('SECURITY_EVAL_CODE'),
    pumpsEvalCode: text('PUMPS_EVAL_CODE'),
    otherEvalCode: text('OTHER_EVAL_CODE'),
    complianceEvalCode: text('COMPLIANCE_EVAL_CODE'),
    dataVerificationEvalCode: text('DATA_VERIFICATION_EVAL_CODE'),
    treatmentEvalCode: text('TREATMENT_EVAL_CODE'),
    finishedWaterStorEvalCode: text('FINISHED_WATER_STOR_EVAL_CODE'),
    distributionEvalCode: text('DISTRIBUTION_EVAL_CODE'),
    financialEvalCode: text('FINANCIAL_EVAL_CODE'),
    visitComments: text('VISIT_COMMENTS'),
    firstReportedDate: text('FIRST_REPORTED_DATE'),
    lastReportedDate: text('LAST_REPORTED_DATE'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.submissionYearQuarter, table.pwsid, table.visitId] }),
    fkPws: foreignKey({
      columns: [table.submissionYearQuarter, table.pwsid],
      foreignColumns: [pubWaterSystems.submissionYearQuarter, pubWaterSystems.pwsid],
    }),
  })
);

// Geographic Areas
export const geographicAreas = sqliteTable(
  'SDWA_GEOGRAPHIC_AREAS',
  {
    submissionYearQuarter: text('SUBMISSIONYEARQUARTER').notNull(),
    pwsid: text('PWSID').notNull(),
    geoId: text('GEO_ID').notNull(),
    areaTypeCode: text('AREA_TYPE_CODE').notNull(),
    tribalCode: text('TRIBAL_CODE'),
    stateServed: text('STATE_SERVED'),
    ansiEntityCode: text('ANSI_ENTITY_CODE'),
    zipCodeServed: text('ZIP_CODE_SERVED'),
    cityServed: text('CITY_SERVED'),
    countyServed: text('COUNTY_SERVED'),
    lastReportedDate: text('LAST_REPORTED_DATE'),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.submissionYearQuarter, table.pwsid, table.geoId, table.areaTypeCode],
    }),
    fkPws: foreignKey({
      columns: [table.submissionYearQuarter, table.pwsid],
      foreignColumns: [pubWaterSystems.submissionYearQuarter, pubWaterSystems.pwsid],
    }),
  })
);

// Service Areas
export const serviceAreas = sqliteTable(
  'SDWA_SERVICE_AREAS',
  {
    submissionYearQuarter: text('SUBMISSIONYEARQUARTER').notNull(),
    pwsid: text('PWSID').notNull(),
    serviceAreaTypeCode: text('SERVICE_AREA_TYPE_CODE'),
    isPrimaryServiceAreaCode: text('IS_PRIMARY_SERVICE_AREA_CODE'),
    firstReportedDate: text('FIRST_REPORTED_DATE'),
    lastReportedDate: text('LAST_REPORTED_DATE'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.submissionYearQuarter, table.pwsid] }),
    fkPws: foreignKey({
      columns: [table.submissionYearQuarter, table.pwsid],
      foreignColumns: [pubWaterSystems.submissionYearQuarter, pubWaterSystems.pwsid],
    }),
  })
);

// Events Milestones
export const eventsMilestones = sqliteTable(
  'SDWA_EVENTS_MILESTONES',
  {
    submissionYearQuarter: text('SUBMISSIONYEARQUARTER').notNull(),
    pwsid: text('PWSID').notNull(),
    eventScheduleId: text('EVENT_SCHEDULE_ID').notNull(),
    eventEndDate: text('EVENT_END_DATE'),
    eventActualDate: text('EVENT_ACTUAL_DATE'),
    eventCommentsText: text('EVENT_COMMENTS_TEXT'),
    eventMilestoneCode: text('EVENT_MILESTONE_CODE'),
    eventReasonCode: text('EVENT_REASON_CODE'),
    firstReportedDate: text('FIRST_REPORTED_DATE'),
    lastReportedDate: text('LAST_REPORTED_DATE'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.submissionYearQuarter, table.pwsid, table.eventScheduleId] }),
    fkPws: foreignKey({
      columns: [table.submissionYearQuarter, table.pwsid],
      foreignColumns: [pubWaterSystems.submissionYearQuarter, pubWaterSystems.pwsid],
    }),
  })
);

// Public Notice Violation Associations
export const pnViolationAssoc = sqliteTable(
  'SDWA_PN_VIOLATION_ASSOC',
  {
    submissionYearQuarter: text('SUBMISSIONYEARQUARTER').notNull(),
    pwsid: text('PWSID').notNull(),
    pnViolationId: text('PN_VIOLATION_ID').notNull(),
    relatedViolationId: text('RELATED_VIOLATION_ID'),
    complPerBeginDate: text('COMPL_PER_BEGIN_DATE'),
    complPerEndDate: text('COMPL_PER_END_DATE'),
    nonComplPerBeginDate: text('NON_COMPL_PER_BEGIN_DATE'),
    nonComplPerEndDate: text('NON_COMPL_PER_END_DATE'),
    violationCode: text('VIOLATION_CODE'),
    contaminationCode: text('CONTAMINANT_CODE'),
    firstReportedDate: text('FIRST_REPORTED_DATE'),
    lastReportedDate: text('LAST_REPORTED_DATE'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.submissionYearQuarter, table.pwsid, table.pnViolationId] }),
    fkPws: foreignKey({
      columns: [table.submissionYearQuarter, table.pwsid],
      foreignColumns: [pubWaterSystems.submissionYearQuarter, pubWaterSystems.pwsid],
    }),
  })
);
