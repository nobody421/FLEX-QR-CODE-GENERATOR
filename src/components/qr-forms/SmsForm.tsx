import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SmsFormProps {
  onValueChange: (value: string) => void;
}

export const SmsForm: React.FC<SmsFormProps> = ({ onValueChange }) => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sms = `smsto:${phone}:${encodeURIComponent(message)}`;
    onValueChange(sms);
  }, [phone, message, onValueChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sms-phone">Phone Number</Label>
        <Input id="sms-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1234567890" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sms-message">Message</Label>
        <Textarea id="sms-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message..." />
      </div>
    </div>
  );
};