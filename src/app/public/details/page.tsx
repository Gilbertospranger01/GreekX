"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import Image from "next/image";  // Import Image from next/image

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductDetails = ({ params }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        notFound();
      } else {
        setProduct(data);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <Image
          src={product.image}  // Use next/image for the image
          alt={product.name}
          width={500}  // Set width for optimization
          height={500}  // Set height for optimization
          className="w-full h-64 object-cover mb-4"
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium text-gray-950">{product.name}</h1>
        <p className="text-gray-500">{product.description}</p>
        <div className="h-[2px] bg-gray-100" />
        <h2 className="font-medium text-2xl">${product.price}</h2>
        <div className="h-[2px] bg-gray-100" />
      </div>
    </div>
  );
};

export default ProductDetails;
