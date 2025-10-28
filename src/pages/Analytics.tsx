import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowLeft, Hash, Globe, Monitor, Clock, Download } from 'lucide-react';

interface QrCodeDetails {
  id: string;
  name: string;
  destination_url: string;
  created_at: string;
  scan_limit: number | null;
}

interface ScanData {
  id: string;
  ip_address: string;
  user_agent: string;
  referrer: string;
  geolocation: { country: string; city: string; region: string };
  scanned_at: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Analytics = () => {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();
  const navigate = useNavigate();
  
  const [details, setDetails] = useState<QrCodeDetails | null>(null);
  const [scans, setScans] = useState<ScanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalScans, setTotalScans] = useState(0);

  useEffect(() => {
    if (qrCodeId) {
      fetchAnalyticsData(qrCodeId);
    }
  }, [qrCodeId]);

  const fetchAnalyticsData = async (id: string) => {
    try {
      setLoading(true);
      
      // 1. Fetch QR Code Details
      const { data: qrData, error: qrError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', id)
        .single();

      if (qrError || !qrData) throw new Error('QR Code not found or access denied.');
      setDetails(qrData);

      // 2. Fetch Scan Data
      const { data: scanData, error: scanError } = await supabase
        .from('qr_scans')
        .select('*')
        .eq('qr_code_id', id)
        .order('scanned_at', { ascending: true });

      if (scanError) throw scanError;
      
      setScans(scanData as ScanData[]);
      setTotalScans(scanData.length);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      showError('Failed to load analytics data. Check if the QR code exists.');
    } finally {
      setLoading(false);
    }
  };

  // --- Data Processing Functions ---

  const getScansByDay = () => {
    const counts = scans.reduce((acc, scan) => {
      const date = new Date(scan.scanned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map(date => ({ date, scans: counts[date] }));
  };

  const getScansByCountry = () => {
    const counts = scans.reduce((acc, scan) => {
      const country = scan.geolocation?.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts)
      .map(country => ({ name: country, value: counts[country] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const getScansByDevice = () => {
    const counts = scans.reduce((acc, scan) => {
      const userAgent = scan.user_agent.toLowerCase();
      let device = 'Other';
      if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone')) {
        device = 'Mobile';
      } else if (userAgent.includes('macintosh') || userAgent.includes('windows') || userAgent.includes('linux')) {
        device = 'Desktop';
      }
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map(device => ({ name: device, value: counts[device] }));
  };

  const handleExportCSV = () => {
    if (scans.length === 0) {
      showError('No scan data to export.');
      return;
    }

    const headers = ['Scan ID', 'Timestamp', 'IP Address', 'Country', 'City', 'User Agent', 'Referrer'];
    const rows = scans.map(scan => [
      scan.id,
      scan.scanned_at,
      scan.ip_address,
      scan.geolocation?.country || 'N/A',
      scan.geolocation?.city || 'N/A',
      scan.user_agent.replace(/,/g, ';'), // Escape commas in user agent
      scan.referrer,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${details?.name.replace(/\s/g, '_') || 'qr_code'}_scans.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess('Scan data exported successfully!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!details) {
    return <div className="text-center py-12 text-muted-foreground">QR Code not found.</div>;
  }

  const scansByDayData = getScansByDay();
  const scansByCountryData = getScansByCountry();
  const scansByDeviceData = getScansByDevice();

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-2">{details.name} Analytics</h1>
      <p className="text-muted-foreground mb-6 truncate">Destination: {details.destination_url}</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScans}</div>
            <p className="text-xs text-muted-foreground">
              {details.scan_limit ? `Limit: ${details.scan_limit}` : 'Unlimited scans'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">First Scan</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scans.length > 0 ? new Date(scans[0].scanned_at).toLocaleDateString() : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {scans.length > 0 ? new Date(scans[0].scanned_at).toLocaleTimeString() : ''}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(scans.map(s => s.ip_address)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Total unique visitors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Scans Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scansByDayData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scans" fill="#3b82f6" name="Daily Scans" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-4 w-4" /> Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scansByCountryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {scansByCountryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Monitor className="h-4 w-4" /> Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scansByDeviceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {scansByDeviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;