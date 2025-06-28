'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Download, Calendar, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface SiteVisit {
  visitId: string;
  pwsid: string;
  pwsName: string;
  visitDate: string | null;
  visitReasonCode: string | null;
  managementOpsEvalCode: string | null;
  sourceWaterEvalCode: string | null;
  treatmentEvalCode: string | null;
  distributionEvalCode: string | null;
  financialEvalCode: string | null;
  outstandingPerformerInd: string | null;
}

export default function InspectionsPage() {
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [evalFilter, setEvalFilter] = useState('all');

  useEffect(() => {
    async function fetchVisits() {
      try {
        const response = await fetch('/api/inspections');
        const data = await response.json();
        setVisits(data);
        setFilteredVisits(data);
      } catch (error) {
        console.error('Error fetching inspections:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVisits();
  }, []);

  useEffect(() => {
    let filtered = visits;

    // Reason filter
    if (reasonFilter !== 'all') {
      filtered = filtered.filter((v) => v.visitReasonCode === reasonFilter);
    }

    // Year filter
    if (yearFilter !== 'all') {
      filtered = filtered.filter((v) => v.visitDate && v.visitDate.startsWith(yearFilter));
    }

    // Evaluation filter
    if (evalFilter !== 'all') {
      filtered = filtered.filter((v) => {
        const hasIssue = [
          v.managementOpsEvalCode,
          v.sourceWaterEvalCode,
          v.treatmentEvalCode,
          v.distributionEvalCode,
          v.financialEvalCode,
        ].some((code) => code === 'S' || code === 'M');

        return evalFilter === 'issues' ? hasIssue : !hasIssue;
      });
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.pwsName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.pwsid.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.visitId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVisits(filtered);
  }, [visits, searchTerm, reasonFilter, yearFilter, evalFilter]);

  const visitStats = useMemo(() => {
    const total = visits.length;
    const withIssues = visits.filter((v) =>
      [
        v.managementOpsEvalCode,
        v.sourceWaterEvalCode,
        v.treatmentEvalCode,
        v.distributionEvalCode,
        v.financialEvalCode,
      ].some((code) => code === 'S' || code === 'M')
    ).length;
    const routine = visits.filter((v) => v.visitReasonCode === 'ROUTINE').length;
    const outstanding = visits.filter((v) => v.outstandingPerformerInd === 'Y').length;

    return { total, withIssues, routine, outstanding };
  }, [visits]);

  const getReasonLabel = (code: string | null) => {
    if (!code) return 'N/A';
    switch (code) {
      case 'ROUTINE':
        return 'Routine';
      case 'FOLLOWUP':
        return 'Follow-up';
      case 'COMPLAINT':
        return 'Complaint';
      case 'EMERGENCY':
        return 'Emergency';
      default:
        return code;
    }
  };

  const EvalBadge = ({ code }: { code: string | null }) => {
    if (!code) return <span className="text-muted-foreground">N/A</span>;

    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      N: 'default',
      M: 'destructive',
      S: 'destructive',
      R: 'secondary',
      X: 'outline',
      Z: 'outline',
      D: 'outline',
    };

    const labels: Record<string, string> = {
      N: 'No Deficiency',
      M: 'Major',
      S: 'Significant',
      R: 'Recommended',
      X: 'Not Evaluated',
      Z: 'Not Applicable',
      D: 'Deficiency',
    };

    const icons: Record<string, React.ReactNode> = {
      N: <CheckCircle className="h-3 w-3" />,
      M: <XCircle className="h-3 w-3" />,
      S: <AlertCircle className="h-3 w-3" />,
    };

    return (
      <Badge variant={variants[code] || 'outline'} className="gap-1">
        {icons[code]}
        {labels[code] || code}
      </Badge>
    );
  };

  const exportToCSV = () => {
    const headers = [
      'Visit ID',
      'PWSID',
      'System Name',
      'Visit Date',
      'Reason',
      'Management',
      'Source Water',
      'Treatment',
      'Distribution',
      'Financial',
      'Outstanding',
    ];
    const rows = filteredVisits.map((v) => [
      v.visitId,
      v.pwsid,
      v.pwsName,
      v.visitDate || 'N/A',
      getReasonLabel(v.visitReasonCode),
      v.managementOpsEvalCode || 'N/A',
      v.sourceWaterEvalCode || 'N/A',
      v.treatmentEvalCode || 'N/A',
      v.distributionEvalCode || 'N/A',
      v.financialEvalCode || 'N/A',
      v.outstandingPerformerInd === 'Y' ? 'Yes' : 'No',
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site_inspections.csv';
    a.click();
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading inspections...</div>;
  }

  return (
    <main className="container mx-auto p-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Site Inspections</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Site Inspections</h1>
        <p className="text-muted-foreground">
          Physical inspections of water system facilities for compliance evaluation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitStats.total.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">With Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {visitStats.withIssues.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Routine Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitStats.routine.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Outstanding Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {visitStats.outstanding.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="System, PWSID, Visit ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reason</label>
              <Select value={reasonFilter} onValueChange={setReasonFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  <SelectItem value="ROUTINE">Routine</SelectItem>
                  <SelectItem value="FOLLOWUP">Follow-up</SelectItem>
                  <SelectItem value="COMPLAINT">Complaint</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Evaluation</label>
              <Select value={evalFilter} onValueChange={setEvalFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="issues">With Issues</SelectItem>
                  <SelectItem value="clean">No Issues</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Water System</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Management</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Distribution</TableHead>
                <TableHead>Financial</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.slice(0, 100).map((visit, index) => (
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {visit.visitDate || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getReasonLabel(visit.visitReasonCode)}</Badge>
                  </TableCell>
                  <TableCell>
                    <EvalBadge code={visit.managementOpsEvalCode} />
                  </TableCell>
                  <TableCell>
                    <EvalBadge code={visit.sourceWaterEvalCode} />
                  </TableCell>
                  <TableCell>
                    <EvalBadge code={visit.treatmentEvalCode} />
                  </TableCell>
                  <TableCell>
                    <EvalBadge code={visit.distributionEvalCode} />
                  </TableCell>
                  <TableCell>
                    <EvalBadge code={visit.financialEvalCode} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredVisits.length > 100 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Showing 100 of {filteredVisits.length} inspections. Use filters to narrow results.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
