import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { QrCodeCard } from '@/components/dashboard/QrCodeCard';
import { Plus, Search, BarChart3, QrCode, Calendar, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QrCode {
  id: string;
  name: string;
  short_code: string;
  destination_url: string;
  created_at: string;
  custom_pattern?: string;
  scan_count?: number;
  campaign_source?: string;
  campaign_medium?: string;
  scan_limit?: number;
}

const Dashboard = () => {
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalQrCodes, setTotalQrCodes] = useState(0);
  const [totalScans, setTotalScans] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get QR codes with scan counts
      const { data, error } = await supabase
        .from('qr_codes')
        .select(`
          *,
          qr_scans(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include scan counts
      const qrCodesWithCounts = data.map(qr => ({
        ...qr,
        scan_count: qr.qr_scans?.[0]?.count || 0
      }));

      setQrCodes(qrCodesWithCounts);
      setTotalQrCodes(qrCodesWithCounts.length);
      
      // Calculate total scans
      const total = qrCodesWithCounts.reduce((sum, qr) => sum + (qr.scan_count || 0), 0);
      setTotalScans(total);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const filteredQrCodes = qrCodes.filter(qr => 
    qr.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qr.short_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qr.destination_url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your QR codes and track analytics</p>
        </div>
        <Button onClick={() => navigate('/qr-generator')} className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          Create New QR
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total QR Codes</p>
                <p className="text-2xl font-bold">{totalQrCodes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Hash className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Scans</p>
                <p className="text-2xl font-bold">{totalScans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Scans/QR</p>
                <p className="text-2xl font-bold">
                  {totalQrCodes > 0 ? (totalScans / totalQrCodes).toFixed(1) : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQrCodes.length > 0 ? (
            filteredQrCodes.map((qr) => (
              <QrCodeCard
                key={qr.id}
                id={qr.id}
                name={qr.name}
                shortCode={qr.short_code}
                destinationUrl={qr.destination_url}
                scanCount={qr.scan_count || 0}
                createdAt={qr.created_at}
                customPattern={qr.custom_pattern}
                campaignSource={qr.campaign_source}
                campaignMedium={qr.campaign_medium}
                scanLimit={qr.scan_limit}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No QR codes found</p>
              <Button 
                onClick={() => navigate('/qr-generator')} 
                className="mt-4"
              >
                Create your first QR code
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;