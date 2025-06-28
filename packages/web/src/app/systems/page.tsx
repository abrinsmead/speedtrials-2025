'use client';

import { useState, useEffect } from 'react';
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
import { Search, Download } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface WaterSystem {
  pwsid: string;
  pwsName: string;
  pwsTypeCode: string;
  populationServedCount: number | null;
  pwsActivityCode: string;
  primacyAgencyCode: string;
  ownerTypeCode: string | null;
  countyServed: string | null;
  cityServed: string | null;
}

export default function SystemsPage() {
  const [systems, setSystems] = useState<WaterSystem[]>([]);
  const [filteredSystems, setFilteredSystems] = useState<WaterSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('active');
  const [sizeFilter, setSizeFilter] = useState('all');

  useEffect(() => {
    async function fetchSystems() {
      try {
        const response = await fetch('/api/systems');
        const data = await response.json();
        setSystems(data);
        setFilteredSystems(data.filter((s: WaterSystem) => s.pwsActivityCode === 'A'));
      } catch (error) {
        console.error('Error fetching systems:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSystems();
  }, []);

  useEffect(() => {
    let filtered = systems;

    // Activity filter
    if (activityFilter === 'active') {
      filtered = filtered.filter((s) => s.pwsActivityCode === 'A');
    } else if (activityFilter === 'inactive') {
      filtered = filtered.filter((s) => s.pwsActivityCode !== 'A');
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((s) => s.pwsTypeCode === typeFilter);
    }

    // Size filter
    if (sizeFilter !== 'all') {
      filtered = filtered.filter((s) => {
        const pop = s.populationServedCount || 0;
        switch (sizeFilter) {
          case 'small':
            return pop < 500;
          case 'medium':
            return pop >= 500 && pop < 3300;
          case 'large':
            return pop >= 3300 && pop < 10000;
          case 'very-large':
            return pop >= 10000;
          default:
            return true;
        }
      });
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.pwsName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.pwsid.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.cityServed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.countyServed?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSystems(filtered);
  }, [systems, searchTerm, typeFilter, activityFilter, sizeFilter]);

  const getTypeLabel = (code: string) => {
    switch (code) {
      case 'CWS':
        return 'Community';
      case 'NTNCWS':
        return 'Non-Transient Non-Community';
      case 'TNCWS':
        return 'Transient Non-Community';
      default:
        return code;
    }
  };

  const exportToCSV = () => {
    const headers = ['PWSID', 'Name', 'Type', 'Population', 'Status', 'County', 'City'];
    const rows = filteredSystems.map((s) => [
      s.pwsid,
      s.pwsName,
      getTypeLabel(s.pwsTypeCode),
      s.populationServedCount || 'N/A',
      s.pwsActivityCode === 'A' ? 'Active' : 'Inactive',
      s.countyServed || 'N/A',
      s.cityServed || 'N/A',
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'water_systems.csv';
    a.click();
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading water systems...</div>;
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
            <BreadcrumbLink>Water Systems</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Water Systems</h1>
        <p className="text-muted-foreground">Browse and search all water systems in Georgia</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Systems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systems.length.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Systems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systems.filter((s) => s.pwsActivityCode === 'A').length.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Population Served</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systems.reduce((sum, s) => sum + (s.populationServedCount || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredSystems.length.toLocaleString()}</div>
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
                  placeholder="Name, PWSID, City, County..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Systems</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="CWS">Community</SelectItem>
                  <SelectItem value="NTNCWS">Non-Transient Non-Community</SelectItem>
                  <SelectItem value="TNCWS">Transient Non-Community</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Size</label>
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small">Small (&lt;500)</SelectItem>
                  <SelectItem value="medium">Medium (500-3,299)</SelectItem>
                  <SelectItem value="large">Large (3,300-9,999)</SelectItem>
                  <SelectItem value="very-large">Very Large (10,000+)</SelectItem>
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
                <TableHead>System Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Population</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>County</TableHead>
                <TableHead>City</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSystems.slice(0, 100).map((system) => (
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
                  <TableCell>
                    <Badge variant={system.pwsActivityCode === 'A' ? 'default' : 'secondary'}>
                      {system.pwsActivityCode === 'A' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{system.countyServed || 'N/A'}</TableCell>
                  <TableCell>{system.cityServed || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredSystems.length > 100 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Showing 100 of {filteredSystems.length} systems. Use filters to narrow results.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
