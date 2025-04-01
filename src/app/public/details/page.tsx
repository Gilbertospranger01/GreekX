"use client";

import Header from "../../../components/header";
import Image from "next/image";

// Definição do tipo Product
type Product = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
};

// Componente ProductDetails sem a tipagem explícita na assinatura da função
const ProductDetails = ({ product }: { product: Product }) => {
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
};

// Use getServerSideProps para buscar os dados do produto
export const getServerSideProps = async (context: any) => {
  const { productId } = context.params; // Supondo que o ID do produto esteja na URL

  // Faça a requisição para pegar os detalhes do produto
  const res = await fetch(`https://api.example.com/products/${productId}`);
  const product: Product = await res.json();

  return {
    props: {
      product, // Passa os dados do produto como props
    },
  };
};

export default ProductDetails;
