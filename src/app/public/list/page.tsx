"use client";
import Image from "next/image";
import Header from "../../../components/header";

type Product = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
};

export default function ProductList({ products, onSelect }: { products: Product[]; onSelect: (id: string) => void }) {
  return (
    <div className="bg-gray-900 mt-18">
      <Header/>
      <div>
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelect(product.id)}
            className="p-6 border-b border-gray-700 hover:bg-gray-700 cursor-pointer flex gap-6"
          >
            <Image
              src={product.image || "/placeholder.jpg"}
              width={200}
              height={200}
              priority
              alt={product.name}
              className="rounded-lg object-cover"
            />
            <div className="block">
              <h2 className="text-xl text-white">{product.name}</h2>
              <p className="text-gray-400">{product.description}</p>
              <p className="text-yellow-400">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

