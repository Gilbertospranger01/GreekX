"use client";

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


  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")                   // remove acentos
      .replace(/[\u0300-\u036f]/g, "")   // remove acentos
      .replace(/[^a-z0-9]+/g, "-")       // substitui tudo que não for letra/número por hífen
      .replace(/^-+|-+$/g, "");          // remove hífens extras do início/fim
  
  const handleSearch = () => {
    if (value.trim()) {
      onSearch();
      const slug = slugify(value.trim());
      router.push(`/list/${slug}`);
    }
  };
  

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
        .ilike("name", `%${productName}%`);

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
