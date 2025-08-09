import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { apiFetch } from '../lib/api';

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  useEffect(() => {
    apiFetch('/api/sales/invoices').then(setInvoices);
  }, []);
  return (
    <View>
      {invoices.map(i => (
        <Text key={i.id}>{i.customer} - {i.total}</Text>
      ))}
    </View>
  );
}
