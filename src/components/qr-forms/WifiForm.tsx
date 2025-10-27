import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WifiFormProps {
  onValueChange: (value: string) => void;
}

export const WifiForm: React.FC<WifiFormProps> = ({ onValueChange }) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');

  useEffect(() => {
    const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    onValueChange(wifiString);
  }, [ssid, password, encryption, onValueChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
        <Input id="wifi-ssid" value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="My WiFi Network" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="wifi-password">Password</Label>
        <Input id="wifi-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      </div>
      <div className="space-y-2">
        <Label>Encryption</Label>
        <Select onValueChange={setEncryption} defaultValue={encryption}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA">WPA/WPA2</SelectItem>
            <SelectItem value="WEP">WEP</SelectItem>
            <SelectItem value="nopass">None</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};