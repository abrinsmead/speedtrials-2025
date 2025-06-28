'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import { Search, Download } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface Violation {
  pwsid: string;
  violationId: string;
  violationTypeCode: string;
  violationCategoryCode: string;
  contaminantCode: string | null;
  pwsName: string;
  isHealthBasedInd: string | null;
  complBeginDate: string | null;
  complEndDate: string | null;
  nonComplBeginDate: string | null;
  complPerEndDate: string | null;
}

export default function ViolationsPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [healthBasedFilter, setHealthBasedFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  useEffect(() => {
    async function fetchViolations() {
      try {
        const response = await fetch('/api/violations');
        const data = await response.json();
        setViolations(data);
      } catch (error) {
        console.error('Error fetching violations:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchViolations();
  }, []);

  const filteredViolations = useMemo(() => {
    let filtered = violations;

    // Status filter
    if (statusFilter === 'Unaddressed') {
      filtered = filtered.filter((v) => !v.complEndDate);
    } else if (statusFilter === 'Resolved') {
      filtered = filtered.filter((v) => v.complEndDate);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((v) => v.violationCategoryCode === categoryFilter);
    }

    // Health-based filter
    if (healthBasedFilter === 'health') {
      filtered = filtered.filter((v) => v.isHealthBasedInd === 'Y');
    } else if (healthBasedFilter === 'monitoring') {
      filtered = filtered.filter((v) => v.isHealthBasedInd !== 'Y');
    }

    // Year filter
    if (yearFilter !== 'all') {
      filtered = filtered.filter((v) => {
        const date = v.complBeginDate || v.nonComplBeginDate;
        return date && date.startsWith(yearFilter);
      });
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.pwsName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.pwsid.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.violationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.contaminantCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [violations, searchTerm, statusFilter, categoryFilter, healthBasedFilter, yearFilter]);

  const violationStats = useMemo(() => {
    const total = violations.length;
    const unaddressed = violations.filter((v) => !v.complEndDate).length;
    const healthBased = violations.filter((v) => v.isHealthBasedInd === 'Y').length;
    const resolved = violations.filter((v) => v.complEndDate).length;

    return { total, unaddressed, healthBased, resolved };
  }, [violations]);

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

  const exportToCSV = () => {
    const headers = [
      'PWSID',
      'System Name',
      'Violation ID',
      'Type',
      'Category',
      'Contaminant',
      'Health Based',
      'Begin Date',
      'End Date',
      'Status',
    ];
    const rows = filteredViolations.map((v) => [
      v.pwsid,
      v.pwsName,
      v.violationId,
      v.violationTypeCode,
      getCategoryLabel(v.violationCategoryCode),
      v.contaminantCode || 'N/A',
      v.isHealthBasedInd === 'Y' ? 'Yes' : 'No',
      v.complBeginDate || v.nonComplBeginDate || 'N/A',
      v.complEndDate || 'Ongoing',
      v.complEndDate ? 'Resolved' : 'Unaddressed',
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'violations.csv';
    a.click();
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading violations...</div>;
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
            <BreadcrumbLink>Violations</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Violations</h1>
        <p className="text-muted-foreground">
          Browse and search all Safe Drinking Water Act violations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{violationStats.total.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Unaddressed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {violationStats.unaddressed.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Health-Based</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{violationStats.healthBased.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {violationStats.resolved.toLocaleString()}
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
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="System, PWSID, Violation ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Violations</SelectItem>
                  <SelectItem value="Unaddressed">Unaddressed Only</SelectItem>
                  <SelectItem value="Resolved">Resolved Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="MR">Monitoring & Reporting</SelectItem>
                  <SelectItem value="MCL">Maximum Contaminant Level</SelectItem>
                  <SelectItem value="TT">Treatment Technique</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={healthBasedFilter} onValueChange={setHealthBasedFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="health">Health-Based Only</SelectItem>
                  <SelectItem value="monitoring">Monitoring Only</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Water System</TableHead>
                <TableHead>Violation ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contaminant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredViolations.slice(0, 100).map((violation) => (
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
                    <Link
                      href={`/violations/${violation.pwsid}/${violation.violationId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {violation.violationId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCategoryLabel(violation.violationCategoryCode)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {violation.contaminantCode ? (
                      <Badge variant="secondary">{violation.contaminantCode}</Badge>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {violation.complBeginDate || violation.nonComplBeginDate || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={violation.complEndDate ? 'default' : 'destructive'}>
                      {violation.complEndDate ? 'Resolved' : 'Unaddressed'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={violation.isHealthBasedInd === 'Y' ? 'destructive' : 'secondary'}
                    >
                      {violation.isHealthBasedInd === 'Y' ? 'Health-Based' : 'Monitoring'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredViolations.length > 100 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Showing 100 of {filteredViolations.length} violations. Use filters to narrow results.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
