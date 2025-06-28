import { db } from './index';
import { eq, and, like, desc, sql, isNotNull } from 'drizzle-orm';
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
  const result = await db
    .select({
      violationId: violationsEnforcement.violationId,
      pwsid: violationsEnforcement.pwsid,
      pwsName: pubWaterSystems.pwsName,
      primacyAgencyCode: pubWaterSystems.primacyAgencyCode,
      violationCode: violationsEnforcement.violationCode,
      violationTypeCode: violationsEnforcement.violationTypeCode,
      violationCategoryCode: violationsEnforcement.violationCategoryCode,
      contaminantCode: violationsEnforcement.contaminantCode,
      isHealthBasedInd: violationsEnforcement.isHealthBasedInd,
      complBeginDate: violationsEnforcement.complPerBeginDate,
      complEndDate: violationsEnforcement.complPerEndDate,
      nonComplBeginDate: violationsEnforcement.nonComplPerBeginDate,
      federalMcl: violationsEnforcement.federalMcl,
      stateMcl: violationsEnforcement.stateMcl,
      isMajorViolInd: violationsEnforcement.isMajorViolInd,
      severityIndCnt: violationsEnforcement.severityIndCnt,
      publicNotificationTier: violationsEnforcement.publicNotificationTier,
      violationStatus: violationsEnforcement.violationStatus,
      ruleCode: violationsEnforcement.ruleCode,
      ruleGroupCode: violationsEnforcement.ruleGroupCode,
      ruleFamilyCode: violationsEnforcement.ruleFamilyCode,
      violFirstReportedDate: violationsEnforcement.violFirstReportedDate,
      violLastReportedDate: violationsEnforcement.violLastReportedDate,
    })
    .from(violationsEnforcement)
    .leftJoin(
      pubWaterSystems,
      and(
        eq(violationsEnforcement.pwsid, pubWaterSystems.pwsid),
        eq(violationsEnforcement.submissionYearQuarter, pubWaterSystems.submissionYearQuarter)
      )
    )
    .where(
      and(
        eq(violationsEnforcement.pwsid, pwsid),
        eq(violationsEnforcement.violationId, violationId),
        eq(violationsEnforcement.submissionYearQuarter, quarter)
      )
    )
    .limit(1);

  return result[0];
}

// Get enforcement actions for a specific violation
export async function getEnforcementsByViolation(
  pwsid: string,
  violationId: string,
  quarter: string = '2025Q1'
) {
  return await db
    .select({
      enforcementId: violationsEnforcement.enforcementId,
      enforcementDate: violationsEnforcement.enforcementDate,
      enforcementActionTypeCode: violationsEnforcement.enforcementActionTypeCode,
      enfActionCategory: violationsEnforcement.enfActionCategory,
      enfOriginatorCode: violationsEnforcement.enfOriginatorCode,
    })
    .from(violationsEnforcement)
    .where(
      and(
        eq(violationsEnforcement.pwsid, pwsid),
        eq(violationsEnforcement.violationId, violationId),
        eq(violationsEnforcement.submissionYearQuarter, quarter),
        isNotNull(violationsEnforcement.enforcementId)
      )
    );
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
