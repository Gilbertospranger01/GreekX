"use client";

import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

// components/productDetails.tsx
interface ProductDetailsProps {
  params: {
    id: string; // O id será passado diretamente aqui
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductDetails = ({ params }: ProductDetailsProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id) // Passando o id diretamente
        .single();

      if (error || !data) {
        notFound(); // Se não encontrar, leva para uma página de erro
      } else {
        setProduct(data);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [params.id]); // Depende do id para refazer a busca

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Exibe os detalhes do produto */}
      <h1>{product?.name}</h1>
      <p>{product?.description}</p>
      <p>{product?.price}</p>
    </div>
  );
};

export default ProductDetails;
