"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../utils/supabase";
import Image from "next/image";

const Create_Products = () => {
    const router = useRouter();
    const [product, setProduct] = useState({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        image: ""
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Obter usuário autenticado
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error("Usuário não autenticado!");
            setLoading(false);
            return;
        }

        let imageUrl = product.image;

        if (imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`;
            const { error } = await supabase.storage
                .from("greekxs/backgroundimages")
                .upload(fileName, imageFile);

            if (error) {
                console.error("Erro ao enviar imagem:", error.message);
                setLoading(false);
                return;
            }

            imageUrl = supabase.storage.from("greekxs/backgroundimages").getPublicUrl(fileName).data.publicUrl;
        }

        const { error } = await supabase.from("products").insert([
            { ...product, image: imageUrl, user_id: user.id }
        ]);


        if (error) {
            console.error("Erro ao criar produto:", error.message);
        } else {
            router.push("/home");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">

            <div className="flex flex-col items-center justify-center w-full p-8 ml-64">
                <h1 className="text-3xl font-bold mb-6">Create Product</h1>
                <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={product.stock}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Image</label>
                        <div className="relative w-[200px] h-[200px] border-2 border-gray-600 rounded-md flex items-center justify-center bg-gray-700 cursor-pointer">
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-md"
                                />
                            ) : (
                                <span className="text-gray-400">Select Image</span>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Product"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Create_Products;