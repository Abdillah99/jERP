'use client';
import { useEffect, useState } from 'react';

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/sales/invoices').then(r => r.json()).then(setInvoices);
  }, []);
  return (
    <ul>
      {invoices.map(inv => (
        <li key={inv.id}>{inv.customer} - {inv.total}</li>
      ))}
    </ul>
  );
}
