"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import supabase from "../../../utils/supabase";
import ProductDetails from "../../../components/ProductDetails"; // Atualizado!
import ProductList from "../list/page";

type Product = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
};

export default function ProductHandler() {
  const params = useParams();
  const param = params?.param as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!param) return;

    async function fetchProducts() {
      setLoading(true);
      const query = supabase.from("products").select("id, image, name, description, price");

      if (isValidUUID(param)) {
        const { data, error } = await query.eq("id", param).single();
        if (!error && data) setProducts([data]);
        else setProducts([]);
      } else {
        const { data, error } = await query.ilike("name", `%${decodeURIComponent(param)}%`);
        if (!error && data) setProducts(data);
        else setProducts([]);
      }

      setLoading(false);
    }

    fetchProducts();
  }, [param]);

  function isValidUUID(value: string) {
    return /^[0-9a-fA-F-]{36}$/.test(value);
  }

  if (loading) return <p className="text-center text-gray-400">Carregando...</p>;
  if (products.length === 0) return <p className="text-center text-red-500">Nenhum produto encontrado.</p>;

  return (
    <>
      {isValidUUID(param) ? (
        <ProductDetails product={products[0]} />
      ) : (
        <ProductList products={products} onSelect={(id) => router.push(`/public/${id}`)} />
      )}
    </>
  );
}
