import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface EmailFormProps {
  onValueChange: (value: string) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ onValueChange }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    onValueChange(mailto);
  }, [to, subject, body, onValueChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-to">To</Label>
        <Input id="email-to" type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-subject">Subject</Label>
        <Input id="email-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email Subject" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-body">Body</Label>
        <Textarea id="email-body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Email body..." />
      </div>
    </div>
  );
};