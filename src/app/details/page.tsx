"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import supabase from "../../utils/supabase";

function Details() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id"); 
  const [product, setProduct] = useState<{
    id: string;
    name: string;
    price: number;
    description: string;
    image?: string;
    stock: number;
  } | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) console.error("Erro ao buscar produto:", error);
      else setProduct(data);
    }

    fetchProduct();
  }, [productId]);

  if (!product) return <p>Carregando...</p>;

  return (
    <div className="bg-white max-w-[300px] w-full rounded-2xl shadow-lg overflow-hidden p-4">
      {product.image && (
        <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
      )}
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-gray-600 text-sm">{product.description}</p>
      <p className="text-green-500 font-bold">Preço: ${product.price}</p>
      <p className="text-gray-500 text-sm">Estoque: {product.stock}</p>
    </div>
  );
}


export default Details;