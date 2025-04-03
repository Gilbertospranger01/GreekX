"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import supabase from "../../../utils/supabase";
import Header from "../../../components/header";
import Image from "next/image";

type Product = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
};

export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      const { data, error } = await supabase.from("products").select("*").eq("id", productId).single();
      
      if (error) {
        console.error("Erro ao buscar produto:", error.message);
        return;
      }
      
      setProduct(data);
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-2xl animate-pulse">Carregando produto...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 mt-18 h-dvh">
      <Header />
      <div className="p-6 border-b border-gray-700 cursor-pointer flex gap-6">
        <Image
          src={product.image || "/placeholder.jpg"}
          width={200}
          height={200}
          priority
          alt={product.name}
          className="rounded-lg object-cover"
        />
        <div className="block">
          <h1 className="text-2xl font-bold text-white">{product.name}</h1>
          <p className="text-gray-400">{product.description}</p>
          <p className="text-yellow-400">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}
          </p>
        </div>
      </div>
    </div>
  );
}
