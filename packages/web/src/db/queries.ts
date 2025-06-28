import { db } from './index';
import { eq, and, like, desc, sql } from 'drizzle-orm';
import {
  pubWaterSystems,
  violationsEnforcement,
  facilities,
  lcrSamples,
  siteVisits,
  geographicAreas,
  refCodeValues,
} from './schema';

// Get all active water systems
export async function getActiveWaterSystems() {
  return await db.select().from(pubWaterSystems).where(eq(pubWaterSystems.pwsActivityCode, 'A'));
}

// Get water system by PWSID
export async function getWaterSystemById(pwsid: string, quarter: string = '2025Q1') {
  const result = await db
    .select()
    .from(pubWaterSystems)
    .where(
      and(eq(pubWaterSystems.pwsid, pwsid), eq(pubWaterSystems.submissionYearQuarter, quarter))
    );

  return result[0];
}

// Get violations for a water system
export async function getViolationsByPwsid(pwsid: string, quarter: string = '2025Q1') {
  return await db
    .select()
    .from(violationsEnforcement)
    .where(
      and(
        eq(violationsEnforcement.pwsid, pwsid),
        eq(violationsEnforcement.submissionYearQuarter, quarter)
      )
    )
    .orderBy(desc(violationsEnforcement.nonComplPerBeginDate));
}

// Get unaddressed violations
export async function getUnaddressedViolations() {
  return await db
    .select({
      pwsid: violationsEnforcement.pwsid,
      pwsName: pubWaterSystems.pwsName,
      violationId: violationsEnforcement.violationId,
      violationCode: violationsEnforcement.violationCode,
      violationStatus: violationsEnforcement.violationStatus,
      contaminantCode: violationsEnforcement.contaminantCode,
      isHealthBased: violationsEnforcement.isHealthBasedInd,
      beginDate: violationsEnforcement.nonComplPerBeginDate,
    })
    .from(violationsEnforcement)
    .leftJoin(
      pubWaterSystems,
      and(
        eq(violationsEnforcement.pwsid, pubWaterSystems.pwsid),
        eq(violationsEnforcement.submissionYearQuarter, pubWaterSystems.submissionYearQuarter)
      )
    )
    .where(eq(violationsEnforcement.violationStatus, 'Unaddressed'))
    .orderBy(desc(violationsEnforcement.nonComplPerBeginDate));
}

// Get facilities for a water system
export async function getFacilitiesByPwsid(pwsid: string, quarter: string = '2025Q1') {
  return await db
    .select()
    .from(facilities)
    .where(and(eq(facilities.pwsid, pwsid), eq(facilities.submissionYearQuarter, quarter)));
}

// Get lead and copper samples
export async function getLcrSamplesByPwsid(pwsid: string, quarter: string = '2025Q1') {
  return await db
    .select()
    .from(lcrSamples)
    .where(and(eq(lcrSamples.pwsid, pwsid), eq(lcrSamples.submissionYearQuarter, quarter)))
    .orderBy(desc(lcrSamples.samplingEndDate));
}

// Get recent site visits
export async function getRecentSiteVisits(limit: number = 100) {
  return await db
    .select({
      visitId: siteVisits.visitId,
      pwsid: siteVisits.pwsid,
      pwsName: pubWaterSystems.pwsName,
      visitDate: siteVisits.visitDate,
      visitReasonCode: siteVisits.visitReasonCode,
      managementOpsEvalCode: siteVisits.managementOpsEvalCode,
      treatmentEvalCode: siteVisits.treatmentEvalCode,
      distributionEvalCode: siteVisits.distributionEvalCode,
    })
    .from(siteVisits)
    .leftJoin(
      pubWaterSystems,
      and(
        eq(siteVisits.pwsid, pubWaterSystems.pwsid),
        eq(siteVisits.submissionYearQuarter, pubWaterSystems.submissionYearQuarter)
      )
    )
    .where(eq(siteVisits.submissionYearQuarter, '2025Q1'))
    .orderBy(desc(siteVisits.visitDate))
    .limit(limit);
}

// Get water systems by county
export async function getWaterSystemsByCounty(county: string) {
  return await db
    .selectDistinct({
      pwsid: pubWaterSystems.pwsid,
      pwsName: pubWaterSystems.pwsName,
      populationServed: pubWaterSystems.populationServedCount,
      pwsTypeCode: pubWaterSystems.pwsTypeCode,
      activityCode: pubWaterSystems.pwsActivityCode,
    })
    .from(pubWaterSystems)
    .innerJoin(
      geographicAreas,
      and(
        eq(pubWaterSystems.pwsid, geographicAreas.pwsid),
        eq(pubWaterSystems.submissionYearQuarter, geographicAreas.submissionYearQuarter)
      )
    )
    .where(
      and(
        eq(geographicAreas.countyServed, county),
        eq(pubWaterSystems.submissionYearQuarter, '2025Q1')
      )
    );
}

// Get reference code description
export async function getCodeDescription(valueType: string, valueCode: string) {
  const result = await db
    .select()
    .from(refCodeValues)
    .where(and(eq(refCodeValues.valueType, valueType), eq(refCodeValues.valueCode, valueCode)));

  return result[0]?.valueDescription;
}

// Get violation statistics
export async function getViolationStats() {
  const stats = await db
    .select({
      totalViolations: sql<number>`COUNT(*)`,
      healthBasedViolations: sql<number>`SUM(CASE WHEN IS_HEALTH_BASED_IND = 'Y' THEN 1 ELSE 0 END)`,
      unaddressedViolations: sql<number>`SUM(CASE WHEN VIOLATION_STATUS = 'Unaddressed' THEN 1 ELSE 0 END)`,
      resolvedViolations: sql<number>`SUM(CASE WHEN VIOLATION_STATUS = 'Resolved' THEN 1 ELSE 0 END)`,
    })
    .from(violationsEnforcement)
    .where(eq(violationsEnforcement.submissionYearQuarter, '2025Q1'));

  return stats[0];
}

// Search water systems by name
export async function searchWaterSystems(searchTerm: string) {
  return await db
    .select()
    .from(pubWaterSystems)
    .where(
      and(
        like(pubWaterSystems.pwsName, `%${searchTerm}%`),
        eq(pubWaterSystems.submissionYearQuarter, '2025Q1')
      )
    )
    .limit(50);
}

// Get all violations with optional filters
export async function getAllViolations(filters?: {
  status?: string;
  isHealthBased?: string;
  contaminantCode?: string;
}) {
  let query = db
    .select({
      violationId: violationsEnforcement.violationId,
      pwsid: violationsEnforcement.pwsid,
      pwsName: pubWaterSystems.pwsName,
      violationTypeCode: violationsEnforcement.violationCode,
      violationCategoryCode: violationsEnforcement.violationCategoryCode,
      contaminantCode: violationsEnforcement.contaminantCode,
      isHealthBasedInd: violationsEnforcement.isHealthBasedInd,
      violationStatus: violationsEnforcement.violationStatus,
      complBeginDate: violationsEnforcement.complPerBeginDate,
      complEndDate: violationsEnforcement.complPerEndDate,
      nonComplBeginDate: violationsEnforcement.nonComplPerBeginDate,
      complPerEndDate: violationsEnforcement.complPerEndDate,
      enforcementDate: violationsEnforcement.enforcementDate,
      enforcementActionType: violationsEnforcement.enforcementActionTypeCode,
    })
    .from(violationsEnforcement)
    .leftJoin(
      pubWaterSystems,
      and(
        eq(violationsEnforcement.pwsid, pubWaterSystems.pwsid),
        eq(violationsEnforcement.submissionYearQuarter, pubWaterSystems.submissionYearQuarter)
      )
    )
    .where(eq(violationsEnforcement.submissionYearQuarter, '2025Q1'));

  // Apply filters if provided
  const conditions = [];
  if (filters?.status) {
    conditions.push(eq(violationsEnforcement.violationStatus, filters.status));
  }
  if (filters?.isHealthBased) {
    conditions.push(eq(violationsEnforcement.isHealthBasedInd, filters.isHealthBased));
  }
  if (filters?.contaminantCode) {
    conditions.push(eq(violationsEnforcement.contaminantCode, filters.contaminantCode));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return await query.orderBy(desc(violationsEnforcement.nonComplPerBeginDate));
}

// Get a single violation by ID
export async function getViolationById(
  pwsid: string,
  violationId: string,
  quarter: string = '2025Q1'
) {
  const result = await db.all(sql`
    SELECT 
      v.VIOLATION_ID as violationId,
      v.PWSID as pwsid,
      p.PWS_NAME as pwsName,
      p.PRIMACY_AGENCY_CODE as primacyAgencyCode,
      v.VIOLATION_CODE as violationCode,
      v.VIOLATION_CODE as violationTypeCode,
      v.VIOLATION_CATEGORY_CODE as violationCategoryCode,
      v.CONTAMINANT_CODE as contaminantCode,
      v.IS_HEALTH_BASED_IND as isHealthBasedInd,
      v.COMPL_PER_BEGIN_DATE as complBeginDate,
      v.COMPL_PER_END_DATE as complEndDate,
      v.NON_COMPL_PER_BEGIN_DATE as nonComplBeginDate,
      v.FEDERAL_MCL as federalMcl,
      CAST(v.STATE_MCL AS TEXT) as stateMcl,
      v.IS_MAJOR_VIOL_IND as isMajorViolInd,
      CAST(v.SEVERITY_IND_CNT AS TEXT) as severityIndCnt,
      CAST(v.PUBLIC_NOTIFICATION_TIER AS TEXT) as publicNotificationTier,
      v.VIOLATION_STATUS as violationStatus,
      v.RULE_CODE as ruleCode,
      v.RULE_GROUP_CODE as ruleGroupCode,
      v.RULE_FAMILY_CODE as ruleFamilyCode,
      v.VIOL_FIRST_REPORTED_DATE as violFirstReportedDate,
      v.VIOL_LAST_REPORTED_DATE as violLastReportedDate
    FROM SDWA_VIOLATIONS_ENFORCEMENT v
    LEFT JOIN SDWA_PUB_WATER_SYSTEMS p 
      ON v.PWSID = p.PWSID 
      AND v.SUBMISSIONYEARQUARTER = p.SUBMISSIONYEARQUARTER
    WHERE v.PWSID = ${pwsid}
      AND v.VIOLATION_ID = ${violationId}
      AND v.SUBMISSIONYEARQUARTER = ${quarter}
    LIMIT 1
  `);

  return result[0] || null;
}

// Get enforcement actions for a specific violation
export async function getEnforcementsByViolation(
  pwsid: string,
  violationId: string,
  quarter: string = '2025Q1'
) {
  const result = await db.all(sql`
    SELECT 
      ENFORCEMENT_ID as enforcementId,
      ENFORCEMENT_DATE as enforcementDate,
      ENFORCEMENT_ACTION_TYPE_CODE as enforcementActionTypeCode,
      ENF_ACTION_CATEGORY as enfActionCategory,
      ENF_ORIGINATOR_CODE as enfOriginatorCode
    FROM SDWA_VIOLATIONS_ENFORCEMENT
    WHERE PWSID = ${pwsid}
      AND VIOLATION_ID = ${violationId}
      AND SUBMISSIONYEARQUARTER = ${quarter}
      AND ENFORCEMENT_ID IS NOT NULL
  `);

  return result;
}

// Get all site visits
export async function getAllSiteVisits(limit?: number) {
  const query = db
    .select({
      visitId: siteVisits.visitId,
      pwsid: siteVisits.pwsid,
      pwsName: pubWaterSystems.pwsName,
      visitDate: siteVisits.visitDate,
      visitReasonCode: siteVisits.visitReasonCode,
      agencyTypeCode: siteVisits.agencyTypeCode,
      managementOpsEvalCode: siteVisits.managementOpsEvalCode,
      sourceWaterEvalCode: siteVisits.sourceWaterEvalCode,
      treatmentEvalCode: siteVisits.treatmentEvalCode,
      distributionEvalCode: siteVisits.distributionEvalCode,
      complianceEvalCode: siteVisits.complianceEvalCode,
      financialEvalCode: siteVisits.financialEvalCode,
      visitComments: siteVisits.visitComments,
      outstandingPerformerInd: siteVisits.outstandingPerformerInd,
    })
    .from(siteVisits)
    .leftJoin(
      pubWaterSystems,
      and(
        eq(siteVisits.pwsid, pubWaterSystems.pwsid),
        eq(siteVisits.submissionYearQuarter, pubWaterSystems.submissionYearQuarter)
      )
    )
    .where(eq(siteVisits.submissionYearQuarter, '2025Q1'))
    .orderBy(desc(siteVisits.visitDate));

  if (limit) {
    return await query.limit(limit);
  }

  return await query;
}

// Get geographic areas for a water system
export async function getGeographicAreasByPwsid(pwsid: string, quarter: string = '2025Q1') {
  return await db
    .select()
    .from(geographicAreas)
    .where(
      and(eq(geographicAreas.pwsid, pwsid), eq(geographicAreas.submissionYearQuarter, quarter))
    );
}

// Get all water systems (for API endpoint)
export async function getAllWaterSystems(quarter: string = '2025Q1') {
  return await db
    .select()
    .from(pubWaterSystems)
    .where(eq(pubWaterSystems.submissionYearQuarter, quarter))
    .orderBy(pubWaterSystems.pwsName);
}
