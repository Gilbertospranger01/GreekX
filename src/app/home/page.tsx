"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import supabase from "../../utils/supabase";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";

const Home = () => {
  const { session } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<{ id: string; name: string; price: number; image?: string; stock: number }[]>([]);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("Usuário");
  const [searchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    console.log(loading);
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("name", `%${searchTerm}%`);

    if (error) {
      console.error("Erro ao buscar dados:", error);
    } else {
      console.log(results);
      setResults(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 0.5); // Delay de 300ms para evitar chamadas excessivas
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    if (session === null) return; // Se ainda está carregando, não faz nada
    if (!session) router.push("/signin");
    else router.push("/home"); // Se há sessão, vai para a Home
  }, [session, router]);

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

  // Novo useEffect para buscar a imagem do perfil
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from("profiles") // Tabela de perfis
        .select("username, picture_url") // Seleciona apenas username e imagem
        .eq("id", session.user.id) // Filtra pelo ID do usuário
        .single(); // Retorna apenas um registro

      if (error) {
        console.error("Erro ao buscar perfil:", error.message);
        return;
      }
      console.log(profilePicture);
      setProfilePicture(data?.picture_url || null); // Define a imagem
      setUsername(data?.username || "Usuário"); // Define o username
    };
    console.log(username);
    fetchUserProfile();
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white text-2xl animate-pulse">Carregando...</p>
      </div>
    );
  }

  return (
    <div>
      <Sidebar />
      <Header/>
      <main className={`bg-gray-900 container mx-auto px-4 py-8 mt-16 max-w-full w-full transition-all`}>
        <section>
          <h3 className="text-2xl font-bold mb-4 text-center md:text-left">Featured Products</h3>
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
                  <p className="text-green-600 font-bold text-2xl ">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}</p>
                  <h4 className="font-bold text-5xl text-white">{product.name}</h4>
                  <button
                    className="mt-2 bg-green-600 text-white px-4 py-2 cursor-pointer rounded-md shadow-md w-full hover:bg-green-700 transition duration-300"
                    onClick={() => router.push(`/public/${product.id}`)}>
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

