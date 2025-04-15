'use server';

import { Product } from '@/types';

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`,
    {cache: 'force-cache'} 
  );
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  return res.json();
}
