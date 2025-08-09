'use client';
import { useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/catalog/products').then(r => r.json()).then(setProducts);
  }, []);
  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
