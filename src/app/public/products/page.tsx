"use client";
import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";
import Image from "next/image";

type Product = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
};


function Products() {
  const [product, setProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;
      setUserId(data.user.id);
    }

    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, image, name, description, price")
        .eq("user_id", userId);

      if (!error) setProduct(data || []);
      setLoading(false);
    }

    fetchProduct();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-800 p-6 text-white">
      <h1 className="text-2xl font-bold text-center mb-6">Meus Produtos</h1>

      {loading ? (
        <p className="text-center text-gray-400">Carregando...</p>
      ) : product.length === 0 ? (
        <p className="text-center text-red-500">Nenhum produto encontrado.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {product.map((product) => (
            <li key={product.id} className="bg-gray-700 p-4 rounded-lg shadow-lg">
              <Image
                src={product.image || "/placeholder.jpg"}
                width={200}
                height={200}
                priority
                alt={product.name}
                className="rounded-lg object-cover w-full h-40"
              />
              <h2 className="text-xl mt-2">{product.name}</h2>
              <p className="text-gray-400">{product.description}</p>
              <p className="text-yellow-400">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Products;

