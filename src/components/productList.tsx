"use client";

type Product = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
};

type ProductListProps = {
  products: Product[];
  onSelect: (id: string) => void;
};

export default function ProductList({ products, onSelect }: ProductListProps) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-4">Lista de Produtos</h1>
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition"
            onClick={() => onSelect(product.id)}
          >
            <h2 className="text-lg font-semibold text-white">{product.name}</h2>
            <p className="text-gray-400">{product.description}</p>
            <p className="text-yellow-400">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
