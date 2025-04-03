"use client";

import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

// components/productDetails.tsx
interface ProductDetailsProps {
  params: {
    id: string;
  };
}

const ProductDetails = ({ params }: ProductDetailsProps) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        notFound();
      } else {
        setProduct(data);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [params.id]);

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
