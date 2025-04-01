"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import supabase from "../utils/supabase";

const Home = () => {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState<{ id: string; name: string; price: number; image?: string; stock: number }[]>([]);


  useEffect(() => {
    if (session === null) return; // Ainda carregando

    const currentPath = window.location.pathname;
    if (session && currentPath !== "/home") {
      router.push("/home");
    } else if (!session && currentPath !== "/") {
      router.push("/");
    }
  }, [session, router, pathname]);

// Função para formatar o preço corretamente
const formatPrice = (price: number) => {
  return price.toLocaleString("en"); // Adiciona "." como separador de milhar
};

useEffect(() => {
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error("Erro ao buscar produtos:", error.message);
      return;
    }

    console.log("Produtos carregados:", data); // Verifique no console
    setProducts(data);
  };

  fetchProducts();
}, []);


return (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    {/* Header */}
    <header className="w-full bg-gray-900 fixed top-0 left-0 border-b z-99 border-gray-700 py-4 flex justify-between items-center px-6">
      <h1 className="text-2xl font-bold text-white">GreekX</h1>
      <div className="space-x-4">
        <Link href="/signin">
          <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition cursor-pointer w-30">Sign In</button>
        </Link>
        <Link href="/signup">
          <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition cursor-pointer w-30">Sign Up</button>
        </Link>
      </div>
    </header>
    <main className={`container mx-auto px-4 py-8 mt-16 mb-10 max-w-full w-full transition-all`}>
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="relative w-full h-[400px] bg-gray-800 shadow-md overflow-hidden">
              <Image
                src={product.image || "/placeholder.jpg"}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-opacity-50 p-4 text-white">
                <p className="text-green-600 font-bold text-2xl ">${formatPrice(product.price)},00</p>
                <h4 className="font-bold text-5xl text-white">{product.name}</h4>
                <button
                  className="mt-2 bg-green-600 text-white px-4 py-2 cursor-pointer rounded-md shadow-md w-full hover:bg-green-700 transition duration-300"
                  onClick={() => router.push(`/product/${product.id}`)}>
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
    <footer className="w-full bg-gray-800 py-3 bottom-0 left-0">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 GreekX. from Kordy All rights reserved.</p>
      </div>
    </footer>
  </div>
);
};

export default Home;

