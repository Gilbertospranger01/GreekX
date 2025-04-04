"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import supabase from "../../utils/supabase";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";

const Home = () => {
  const { session } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<{ id: string; name: string; price: number; description: string; image?: string; stock: number }[]>([]);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("Usuário");
  const [searchTerm] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    console.log(favorites);
  };

  const handleSearch = useCallback(async () => {
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
  }, [searchTerm]); // Apenas searchTerm como dependência

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, handleSearch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, handleSearch]);

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
      <Header />
      <main className={`bg-gray-900 min-h-screen container mx-auto px-4 py-8 mt-16 max-w-full w-full transition-all`}>
        <section>
          <h3 className="text-2xl font-bold mb-4 text-center md:text-left">Featured Products</h3>
          <div className="flex space-x-4 overflow-x-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white max-w-[300px] w-full rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="relative w-full h-[300px]">
                  <Image
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 right-2 bg-opacity-70 p-1 rounded-full hover:bg-opacity-100 transition cursor-pointer"
                  >
                    <Heart
                      size={24}
                      className={`transition ${favorites[product.id] ? "fill-red-500 text-red-500" : "text-white"}`}
                      fill={favorites[product.id] ? "red" : "none"}
                    />
                  </button>
                  <span
                    className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-medium ${product.stock > 0
                      ? "bg-green-600 text-white"
                      : "bg-red-500 text-white"
                      }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-2 pt-5">
                  <h4 className="text-lg font-semibold text-gray-800 truncate">
                    {product.description}
                  </h4>
                  <h4 className="text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                  </h4>
                  <p className="text-green-600 text-xl font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(product.price)}
                  </p>
                  <button
                    className="mt-auto flex gap-2 items-center justify-center bg-green-600 text-white py-2 rounded-xl w-full hover:bg-green-700 transition duration-300 shadow-md cursor-pointer relative disabled:bg-green-400"
                    onClick={() => {
                      if (!loading) {
                        setLoading(true);
                        setTimeout(() => {
                          router.push(`/details?id=${product.id}`);
                        }, 2000);
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-white rounded-full animate-[fadeInOut_1s_infinite]"></div>
                        <div className="h-2 w-2 bg-white rounded-full animate-[fadeInOut_1s_infinite] [animation-delay:0.2s]"></div>
                        <div className="h-2 w-2 bg-white rounded-full animate-[fadeInOut_1s_infinite] [animation-delay:0.4s]"></div>
                      </div>
                    ) : (
                      "Buy Now"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="fixed left-0 bottom-0 w-full bg-gray-800 py-3">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 GreekX. from Kordy All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

