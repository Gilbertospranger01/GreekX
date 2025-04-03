"use client";  // Indica que este componente deve ser tratado como de cliente

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import supabase from '@/utils/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock?: string;
}

const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product>();

  // Garantir que o hook useRouter só seja chamado no cliente
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setProduct(data);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center">
          <img
            src={product.image || "/default-image.jpg"} // Adicione uma imagem padrão caso não exista
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">{product.name}</h1>
          <p className="mt-4 text-lg text-gray-600">{product.description}</p>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xl font-bold text-gray-800">
              ${product.price.toFixed(2)}
            </span>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Add to Cart
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Category: {product.category}</p>
            <p>Stock: {product.stock}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
