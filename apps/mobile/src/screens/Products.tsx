import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { apiFetch } from '../lib/api';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    apiFetch('/api/catalog/products').then(setProducts);
  }, []);
  return (
    <View>
      {products.map(p => (
        <Text key={p.id}>{p.name}</Text>
      ))}
    </View>
  );
}
