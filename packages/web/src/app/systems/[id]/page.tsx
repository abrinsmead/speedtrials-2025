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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Building2, Users, MapPin, Phone, Mail, AlertCircle, Droplets } from 'lucide-react';
import {
  getWaterSystemById,
  getFacilitiesByPwsid,
  getViolationsByPwsid,
  getLcrSamplesByPwsid,
  getGeographicAreasByPwsid,
} from '@/db/queries';

export default async function WaterSystemDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const system = await getWaterSystemById(id);

  if (!system) {
    notFound();
  }

  const [facilities, violations, lcrSamples, geographicAreas] = await Promise.all([
    getFacilitiesByPwsid(id),
    getViolationsByPwsid(id),
    getLcrSamplesByPwsid(id),
    getGeographicAreasByPwsid(id),
  ]);

  const activeViolations = violations.filter((v) => v.violationStatus === 'Unaddressed');
  const resolvedViolations = violations.filter((v) => v.violationStatus === 'Resolved');

  return (
    <main className="container mx-auto p-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{system.pwsName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">{system.pwsName}</h1>
            <p className="text-muted-foreground">PWSID: {system.pwsid}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={system.pwsActivityCode === 'A' ? 'default' : 'secondary'}>
            {system.pwsActivityCode === 'A' ? 'Active' : 'Inactive'}
          </Badge>
          <Badge variant="outline">{system.pwsTypeCode}</Badge>
          <Badge variant="outline">{system.ownerTypeCode}</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Population Served</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {system.populationServedCount?.toLocaleString() || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {system.serviceConnectionsCount?.toLocaleString() || 0} connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Source</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{system.primarySourceCode || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              {system.gwSwCode === 'GW' ? 'Ground Water' : 'Surface Water'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Violations</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{activeViolations.length}</div>
            <p className="text-xs text-muted-foreground">{violations.length} total violations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facilities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilities.length}</div>
            <p className="text-xs text-muted-foreground">
              {facilities.filter((f) => f.facilityActivityCode === 'A').length} active
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Organization</p>
              <p className="text-sm text-muted-foreground">{system.orgName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Administrator</p>
              <p className="text-sm text-muted-foreground">{system.adminName || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{system.phoneNumber || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{system.emailAddr || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm">{system.addressLine1}</p>
                {system.addressLine2 && <p className="text-sm">{system.addressLine2}</p>}
                <p className="text-sm">
                  {system.cityName}, {system.stateCode} {system.zipCode}
                </p>
              </div>
            </div>
            {geographicAreas.length > 0 && (
              <div>
                <p className="text-sm font-medium">Service Areas</p>
                {geographicAreas.map((area, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground">
                    {area.countyServed && `${area.countyServed} County`}
                    {area.cityServed && `, ${area.cityServed}`}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">EPA Region</span>
              <span className="text-sm font-medium">{system.epaRegion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Primacy Agency</span>
              <span className="text-sm font-medium">{system.primacyAgencyCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Grant Eligible</span>
              <Badge variant={system.isGrantEligibleInd === 'Y' ? 'default' : 'secondary'}>
                {system.isGrantEligibleInd === 'Y' ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Wholesaler</span>
              <Badge variant={system.isWholesalerInd === 'Y' ? 'default' : 'secondary'}>
                {system.isWholesalerInd === 'Y' ? 'Yes' : 'No'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="violations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="violations">Violations ({violations.length})</TabsTrigger>
          <TabsTrigger value="facilities">Facilities ({facilities.length})</TabsTrigger>
          <TabsTrigger value="lcr">Lead & Copper ({lcrSamples.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="violations" className="space-y-4">
          {activeViolations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Violations</CardTitle>
                <CardDescription>Unaddressed violations requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Violation ID</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Contaminant</TableHead>
                      <TableHead>Begin Date</TableHead>
                      <TableHead>Health Based</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeViolations.map((violation) => (
                      <TableRow key={violation.violationId} className="hover:bg-orange-50">
                        <TableCell>
                          <Link
                            href={`/violations/${violation.pwsid}/${violation.violationId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {violation.violationId}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">{violation.violationCode}</Badge>
                        </TableCell>
                        <TableCell>{violation.violationCategoryCode}</TableCell>
                        <TableCell>{violation.contaminantCode || 'N/A'}</TableCell>
                        <TableCell>{violation.nonComplPerBeginDate || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              violation.isHealthBasedInd === 'Y' ? 'destructive' : 'secondary'
                            }
                          >
                            {violation.isHealthBasedInd === 'Y' ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {resolvedViolations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resolved Violations</CardTitle>
                <CardDescription>Past violations that have been addressed</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Violation ID</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Resolved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resolvedViolations.slice(0, 10).map((violation) => (
                      <TableRow key={violation.violationId} className="hover:bg-orange-50">
                        <TableCell>
                          <Link
                            href={`/violations/${violation.pwsid}/${violation.violationId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {violation.violationId}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{violation.violationCode}</Badge>
                        </TableCell>
                        <TableCell>{violation.violationCategoryCode}</TableCell>
                        <TableCell>
                          {violation.nonComplPerBeginDate} - {violation.nonComplPerEndDate || 'N/A'}
                        </TableCell>
                        <TableCell>{violation.calculatedRtcDate || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <CardTitle>System Facilities</CardTitle>
              <CardDescription>All facilities associated with this water system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Water Type</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilities.map((facility) => (
                    <TableRow key={facility.facilityId} className="hover:bg-orange-50">
                      <TableCell className="font-mono">{facility.facilityId}</TableCell>
                      <TableCell>{facility.facilityName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{facility.facilityTypeCode}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={facility.facilityActivityCode === 'A' ? 'default' : 'secondary'}
                        >
                          {facility.facilityActivityCode === 'A' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{facility.waterTypeCode || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={facility.isSourceInd === 'Y' ? 'default' : 'secondary'}>
                          {facility.isSourceInd === 'Y' ? 'Source' : 'Non-source'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lcr">
          <Card>
            <CardHeader>
              <CardTitle>Lead & Copper Samples</CardTitle>
              <CardDescription>Lead and copper rule compliance testing results</CardDescription>
            </CardHeader>
            <CardContent>
              {lcrSamples.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sample ID</TableHead>
                      <TableHead>Contaminant</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Sample Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lcrSamples.map((sample) => (
                      <TableRow
                        key={`${sample.sampleId}-${sample.sarId}`}
                        className="hover:bg-orange-50"
                      >
                        <TableCell className="font-mono">{sample.sampleId}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sample.contaminantCode}</Badge>
                        </TableCell>
                        <TableCell>
                          {sample.resultSignCode === 'L' && '<'}
                          {sample.sampleMeasure}
                        </TableCell>
                        <TableCell>{sample.unitOfMeasure}</TableCell>
                        <TableCell>{sample.samplingEndDate || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No lead and copper samples found for this system.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
