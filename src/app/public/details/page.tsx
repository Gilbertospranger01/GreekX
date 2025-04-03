"use client";

import Image from "next/image";
import Header from "../../../components/header";

// Defina o tipo para o produto
type Product = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
};

// Defina a interface para as props, mas não exporte diretamente como default
interface ProductDetailsProps {
  product: Product;
}

// Agora exporte o componente de forma normal
export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="bg-gray-900 mt-18 h-dvh">
      <Header />
      <div className="p-6 border-b border-gray-700 cursor-pointer flex gap-6">
        <Image
          src={product.image || "/placeholder.jpg"}
          width={200}
          height={200}
          priority
          alt={product.name}
          className="rounded-lg object-cover"
        />
        <div className="block">
          <h1 className="text-2xl font-bold text-white">{product.name}</h1>
          <p className="text-gray-400">{product.description}</p>
          <p className="text-yellow-400">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}
          </p>
        </div>
      </div>
    </div>
  );
}
