"use client";

import { useState } from "react";
import Link from "next/link";
import supabase from "@/utils/supabase";

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    if (e.target.value.length >= 3) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${e.target.value}%`);

      if (error) {
        console.error(error);
      } else {
        setProducts(data || []);
      }
    } else {
      setProducts([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <input
        type="text"
        placeholder="Search for products..."
        value={searchTerm}
        onChange={handleSearch}
        className="p-2 w-full max-w-md mb-4 rounded"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              key={product.id}
              href={`/public/details/${product.id}`}
              className="block border p-4 rounded shadow-lg"
            >
              <img src={product.image} alt={product.name} className="w-full h-64 object-cover mb-4" />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p>{product.description}</p>
              <p className="text-xl font-bold">${product.price}</p>
            </Link>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
