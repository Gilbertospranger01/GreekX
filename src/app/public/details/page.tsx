import ProductDetails from "@/components/productDetails";

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  // Simula a busca de dados do produto (Substitua pelo seu fetch real)
  const product = await getProductById(params.id);

  if (!product) {
    return <p className="text-red-500">Produto não encontrado</p>;
  }

  return <ProductDetails product={product} />;
}

// Função para buscar dados (pode ser de uma API, banco de dados, etc.)
async function getProductById(id: string) {
  const products = [
    { id: "1", name: "Produto 1", image: "/prod1.jpg", description: "Descrição do produto 1", price: 29.99 },
    { id: "2", name: "Produto 2", image: "/prod2.jpg", description: "Descrição do produto 2", price: 39.99 },
  ];

  return products.find((p) => p.id === id) || null;
}

