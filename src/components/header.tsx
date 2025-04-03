"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa";
import supabase from "../utils/supabase";
import { useSidebar } from "../context/sidebarcontext";
import Sidebar from "./sidebar";
import InputSearch from "./input-search";
import { motion } from "framer-motion";

type User = {
  id: string;
  name: string;
};

const Header = () => {
  const { session } = useAuth();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const { showSidebar, setShowSidebar } = useSidebar();
  const [products, setProducts] = useState<{ id: string; name: string; price: number; image?: string; stock: number }[]>([]);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("Usuário");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;
      const { data: wallet } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', user.id)
        .single();
      if (wallet) {
        setBalance(wallet.balance || 0);
      }
    }

    fetchData();
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("name", `%${searchTerm}%`);

    if (error) {
      console.error("Erro ao buscar dados:", error);
    } else {
      setResults(data);
    }

    setLoading(false);
  }, [searchTerm, setResults, setLoading]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 500); // Ajustei o tempo para 500ms
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, handleSearch]);
  

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
  
      if (error) {
        console.error("Erro ao buscar produtos:", error.message);
        return;
      }
  
      console.log("Produtos carregados:", data); 
      console.log(products);
      setProducts(data);
    };
  
    fetchProducts();
  }, []);  

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("username, picture_url")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error.message);
        return;
      }

      setProfilePicture(data?.picture_url || null);
      setUsername(data?.username || "Usuário");
    };

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
      <header className="w-full bg-gray-900 fixed top-0 left-0 z-79 border-b pt-2 pb-2 border-gray-400">
        <div className="container mx-auto flex justify-between items-center px-4 relative">
          <button className="md:hidden" onClick={() => setNavOpen(!navOpen)}>
            <FaBars className="text-white text-2xl" />
          </button>
          <Link href="/Header">
            <h1 className="text-2xl font-bold text-white">GreekX</h1>
          </Link>
          <nav
            className={`absolute block md:static top-full left-0 w-full md:w-auto bg-gray-900 md:flex md:space-x-10 md:items-center py-4 pl-4 pt-9 md:p-0 transition ${navOpen ? "block" : "hidden"
              }`}
          >
            <div className="w-full relative">
              <InputSearch
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                onClear={() => {
                  setSearchTerm("");
                  setResults([]);
                }}
              />

              {loading && (
                <div className="absolute w-full bg-gray-800 text-white h-20 shadow-lg mt-2 z-50 flex items-center justify-center">
                  <p className="text-gray-400 text-center">Carregando...</p>
                </div>
              )}

              {!loading && searchTerm.trim() && (
                <div className="absolute w-full bg-gray-800 text-white shadow-lg mt-2 z-50 ">
                  {results.length > 0 ? (
                    <ul className="w-full">
                      {results.map((item, index) => (
                        <li key={index} className="p-2 border-b border-gray-700 hover:bg-gray-700">
                          <button
                            onClick={() => router.push(`/public/${item.id}`)}
                            className="flex items-center gap-8 w-full text-left px-6 py-4 text-white transition cursor-pointer"
                          >
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="absolute w-full bg-gray-800 text-white h-20 shadow-lg  z-50 flex items-center justify-center">
                      <p className="text-gray-400 text-center">Nenhum resultado encontrado.</p>
                    </div>
                  )}
                </div>

              )}
            </div>
          </nav>

          <div className="md:flex items-center">
            <motion.p
              className="font-semibold text-green-500 mr-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5 }}
            >
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(balance)}
            </motion.p>
            <p className="hidden md:block mr-6">
              <span className="text-blue-600 ml-4 mr-8">{username || "No Username"}</span>
            </p>
            <div className="relative">
              <button className="w-14 h-14 flex justify-center items-center cursor-pointer rounded-full border-2 border-gray-500 focus:outline-none"
                onClick={() => setShowSidebar(!showSidebar)}>
                {profilePicture ? (
                  <div className="w-[46px] h-[46px] rounded-full overflow-hidden">
                    <Image
                      src={profilePicture}
                      alt="Profile Picture"
                      width={46}
                      height={46}
                      priority
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-gray-700 rounded-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;

