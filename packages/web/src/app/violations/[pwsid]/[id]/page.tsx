import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  AlertCircle,
  Calendar,
  FileText,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Gavel,
} from 'lucide-react';
import { getViolationById, getEnforcementsByViolation } from '@/db/queries';

interface PageProps {
  params: { pwsid: string; id: string };
}

export default async function ViolationDetailPage({ params }: PageProps) {
  const { pwsid, id } = params;

  try {
    const violation = await getViolationById(pwsid, id);

    if (!violation) {
      notFound();
    }

    const enforcements = (await getEnforcementsByViolation(pwsid, id)) || [];

    const getCategoryLabel = (code: string) => {
      switch (code) {
        case 'MR':
          return 'Monitoring & Reporting';
        case 'MCL':
          return 'Maximum Contaminant Level';
        case 'TT':
          return 'Treatment Technique';
        case 'OTHER':
          return 'Other';
        default:
          return code;
      }
    };

    const getRuleLabel = (code: string | null) => {
      if (!code) return 'N/A';
      switch (code) {
        case 'TCR':
          return 'Total Coliform Rule';
        case 'LCR':
          return 'Lead and Copper Rule';
        case 'DBP2':
          return 'Disinfectants and Disinfection Byproducts Rule';
        case 'SWTR':
          return 'Surface Water Treatment Rule';
        case 'CHEM':
          return 'Chemical Contaminants';
        case 'RAD':
          return 'Radionuclides';
        default:
          return code;
      }
    };

    const getEnforcementTypeLabel = (code: string | null) => {
      if (!code) return 'N/A';
      switch (code) {
        case 'NOV':
          return 'Notice of Violation';
        case 'FORMAL':
          return 'Formal Enforcement';
        case 'CONSENT':
          return 'Consent Order';
        case 'PENALTY':
          return 'Administrative Penalty';
        case 'CRIMINAL':
          return 'Criminal Prosecution';
        default:
          return code;
      }
    };

    return (
      <main className="container mx-auto p-4 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/violations">Violations</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Violation {violation.violationId}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Violation Details</h1>
            {violation.isHealthBasedInd && (
              <Badge
                variant={violation.isHealthBasedInd === 'Y' ? 'destructive' : 'secondary'}
                className="text-lg px-3 py-1"
              >
                {violation.isHealthBasedInd === 'Y' ? 'Health-Based' : 'Monitoring'}
              </Badge>
            )}
            <Badge
              variant={violation.complEndDate ? 'default' : 'destructive'}
              className="text-lg px-3 py-1"
            >
              {violation.complEndDate ? 'Resolved' : 'Unaddressed'}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Violation ID: {violation.violationId} • PWSID: {violation.pwsid}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Water System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">System Name</dt>
                  <dd className="text-lg font-medium">
                    <Link
                      href={`/systems/${violation.pwsid}`}
                      className="text-blue-600 hover:underline"
                    >
                      {violation.pwsName}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">PWSID</dt>
                  <dd className="font-mono">{violation.pwsid}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Primacy Agency</dt>
                  <dd>{violation.primacyAgencyCode || 'N/A'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Violation Classification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                  <dd>
                    <Badge variant="outline">
                      {getCategoryLabel(violation.violationCategoryCode)}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Violation Code</dt>
                  <dd className="font-mono">{violation.violationCode}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Type Code</dt>
                  <dd className="font-mono">{violation.violationTypeCode || 'N/A'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Compliance Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  Compliance Period Begin
                </div>
                <p className="font-medium">{violation.complBeginDate || 'N/A'}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                  {violation.complEndDate ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                  Compliance Period End
                </div>
                <p className="font-medium">{violation.complEndDate || 'Ongoing'}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  Non-Compliance Begin
                </div>
                <p className="font-medium">{violation.nonComplBeginDate || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Violation Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-3">Contaminant Information</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Contaminant Code</dt>
                    <dd>
                      {violation.contaminantCode ? (
                        <Badge variant="secondary">{violation.contaminantCode}</Badge>
                      ) : (
                        'N/A'
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Federal MCL</dt>
                    <dd>{violation.federalMcl || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">State MCL</dt>
                    <dd>{violation.stateMcl || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="font-medium mb-3">Rule Information</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Rule Code</dt>
                    <dd>{getRuleLabel(violation.ruleCode)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Rule Group</dt>
                    <dd>{violation.ruleGroupCode || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Rule Family</dt>
                    <dd>{violation.ruleFamilyCode || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Enforcement Actions
            </CardTitle>
            <CardDescription>
              {enforcements.length > 0
                ? `${enforcements.length} enforcement action(s) taken`
                : 'No enforcement actions recorded'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enforcements.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enforcement ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Originator</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enforcements.map((enforcement) => (
                    <TableRow key={enforcement.enforcementId} className="hover:bg-orange-50">
                      <TableCell className="font-mono">{enforcement.enforcementId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getEnforcementTypeLabel(enforcement.enforcementActionTypeCode)}
                        </Badge>
                      </TableCell>
                      <TableCell>{enforcement.enfActionCategory || 'N/A'}</TableCell>
                      <TableCell>{enforcement.enforcementDate || 'N/A'}</TableCell>
                      <TableCell>{enforcement.enfOriginatorCode || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No enforcement actions have been taken for this violation.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Major Violation</dt>
                <dd>
                  {violation.isMajorViolInd === 'Y' ? (
                    <Badge variant="destructive">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Severity Indicator</dt>
                <dd>{violation.severityIndCnt || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Public Notification Tier
                </dt>
                <dd>{violation.publicNotificationTier || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Violation Status</dt>
                <dd>
                  <Badge
                    variant={violation.violationStatus === 'Resolved' ? 'default' : 'secondary'}
                  >
                    {violation.violationStatus || 'Unknown'}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">First Reported</dt>
                <dd>{violation.violFirstReportedDate || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Reported</dt>
                <dd>{violation.violLastReportedDate || 'N/A'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </main>
    );
  } catch (error) {
    console.error('Error fetching violation details:', error);
    notFound();
  }
}
