"use client";
export const dynamic = "force-dynamic";


import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import supabase from "../../utils/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  stock: number;
}

function List() {
  const searchParams = useSearchParams();
  const productName = searchParams.get("value");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unslugify = (slug: string) => {
    return slug.replace(/-/g, " ");
  };
  const searchQuery = productName ? unslugify(productName) : "";

  useEffect(() => {
    async function fetchProducts() {
      if (!productName) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${searchQuery}%`)

      if (error || !data) {
        setError("Erro ao buscar produtos.");
        console.error("Erro ao buscar produtos:", error);
        setProducts([]);
      } else {
        setProducts(data);
      }

      setLoading(false);
    }

    fetchProducts();
  }, [productName]);

  if (loading) return <p>Carregando...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  if (products.length === 0) return <p>Produto(s) não encontrado(s).</p>;

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {products.map((product) => (
        <div key={product.id} className="bg-white max-w-[300px] w-full rounded-2xl shadow-lg overflow-hidden p-4">
          {product.image && (
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
          )}
          <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
          <p className="text-gray-600 text-sm">{product.description}</p>
          <p className="text-green-500 font-bold">Preço: ${product.price}</p>
          <p className="text-gray-500 text-sm">Estoque: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}

export default List;
