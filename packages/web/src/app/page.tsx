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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Database, Droplets, ArrowRight } from 'lucide-react';
import {
  getActiveWaterSystems,
  getViolationStats,
  getUnaddressedViolations,
  getRecentSiteVisits,
} from '@/db/queries';

export default async function Dashboard() {
  try {
    // Run multiple queries to test the database connection
    const [activeSystems, violationStats, unaddressedViolations, recentVisits] = await Promise.all([
      getActiveWaterSystems(),
      getViolationStats(),
      getUnaddressedViolations(),
      getRecentSiteVisits(10),
    ]);

    return (
      <main className="container mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">SDWIS: Drinking Water Watch</h1>
          </div>
          <p className="text-muted-foreground">
            Real-time monitoring of water quality and compliance across Georgia
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/systems">
            <Card className="cursor-pointer transition-colors hover:bg-orange-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Water Systems</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSystems.length.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Currently serving Georgia residents</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/violations">
            <Card className="cursor-pointer transition-colors hover:bg-orange-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {violationStats?.totalViolations?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {violationStats?.healthBasedViolations || 0} health-based
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/violations?status=Unaddressed">
            <Card className="cursor-pointer transition-colors hover:bg-orange-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unaddressed Violations</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {unaddressedViolations.length.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/violations?status=Resolved">
            <Card className="cursor-pointer transition-colors hover:bg-orange-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {violationStats?.totalViolations
                    ? Math.round(
                        ((violationStats.totalViolations -
                          (violationStats.unaddressedViolations || 0)) /
                          violationStats.totalViolations) *
                          100
                      )
                    : 100}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Violations resolved</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Unaddressed Violations</CardTitle>
              <CardDescription>Critical violations requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System</TableHead>
                    <TableHead>Violation</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unaddressedViolations.slice(0, 5).map((violation) => (
                    <TableRow
                      key={`${violation.pwsid}-${violation.violationId}`}
                      className="hover:bg-orange-50"
                    >
                      <TableCell>
                        <Link href={`/systems/${violation.pwsid}`}>
                          <div className="cursor-pointer hover:underline">
                            <div className="font-medium">{violation.pwsName}</div>
                            <div className="text-sm text-muted-foreground">{violation.pwsid}</div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/violations/${violation.pwsid}/${violation.violationId}`}>
                          <Badge variant="destructive" className="cursor-pointer hover:opacity-80">
                            {violation.violationCode}
                          </Badge>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {violation.isHealthBased === 'Y' ? (
                          <Badge variant="destructive">Health</Badge>
                        ) : (
                          <Badge variant="secondary">Monitoring</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{violation.beginDate || 'Unknown'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {unaddressedViolations.length > 5 && (
                <div className="mt-4 text-center">
                  <Link href="/violations?status=Unaddressed">
                    <Button variant="outline" size="sm">
                      View all {unaddressedViolations.length} violations
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Largest Active Water Systems</CardTitle>
              <CardDescription>Systems serving the most residents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Population</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSystems
                    .sort((a, b) => (b.populationServedCount || 0) - (a.populationServedCount || 0))
                    .slice(0, 5)
                    .map((system) => (
                      <TableRow key={system.pwsid} className="hover:bg-orange-50">
                        <TableCell>
                          <Link href={`/systems/${system.pwsid}`}>
                            <div className="cursor-pointer hover:underline">
                              <div className="font-medium">{system.pwsName}</div>
                              <div className="text-sm text-muted-foreground">{system.pwsid}</div>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{system.pwsTypeCode}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {system.populationServedCount?.toLocaleString() || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {recentVisits.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Site Inspections</CardTitle>
              <CardDescription>Latest compliance visits and evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Management</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Distribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentVisits.map((visit, index) => (
                    <TableRow
                      key={`${visit.visitId}-${visit.pwsid}-${index}`}
                      className="hover:bg-orange-50"
                    >
                      <TableCell>
                        <Link href={`/systems/${visit.pwsid}`}>
                          <div className="cursor-pointer hover:underline">
                            <div className="font-medium">{visit.pwsName}</div>
                            <div className="text-sm text-muted-foreground">{visit.pwsid}</div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>{visit.visitDate || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{visit.visitReasonCode || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>
                        <EvalBadge code={visit.managementOpsEvalCode} />
                      </TableCell>
                      <TableCell>
                        <EvalBadge code={visit.treatmentEvalCode} />
                      </TableCell>
                      <TableCell>
                        <EvalBadge code={visit.distributionEvalCode} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-center">
                <Link href="/inspections">
                  <Button variant="outline" size="sm">
                    View all inspections
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load dashboard data'}
          </AlertDescription>
        </Alert>
      </main>
    );
  }
}

function EvalBadge({ code }: { code: string | null }) {
  if (!code) return <Badge variant="outline">N/A</Badge>;

  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    N: 'default', // No deficiencies
    M: 'secondary', // Minor deficiencies
    S: 'destructive', // Significant deficiencies
    R: 'secondary', // Recommendations
    X: 'outline', // Not evaluated
    Z: 'outline', // Not applicable
    D: 'destructive', // Sanitary defect
  };

  const labels: Record<string, string> = {
    N: 'None',
    M: 'Minor',
    S: 'Significant',
    R: 'Recommendations',
    X: 'Not Evaluated',
    Z: 'N/A',
    D: 'Defect',
  };

  return <Badge variant={variants[code] || 'outline'}>{labels[code] || code}</Badge>;
}
