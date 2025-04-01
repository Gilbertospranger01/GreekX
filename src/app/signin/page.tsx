"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import InputPassword from "../../components/input-password";
import { useRouter } from "next/navigation";
import supabase from "../../utils/supabase";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import BackgroundImage from "../../components/backgroundimage";

function Signin() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function uploadProfilePictureFromUrl(userId: string, imageUrl: string) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const fileName = `profile-${userId}.jpg`;

      const { error } = await supabase.storage
        .from("greekxs")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("greekxs")
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      return null;
    }
  }

  async function handleUserSignIn(user: any) {
    const { id, raw_user_meta_data } = user;
    const imageUrl =
      raw_user_meta_data?.picture ||
      raw_user_meta_data?.image_url ||
      raw_user_meta_data?.avatar_url;

    if (!imageUrl) return;

    const newImageUrl = await uploadProfilePictureFromUrl(id, imageUrl);

    if (newImageUrl) {
      await supabase.from("profiles").update({ picture_url: newImageUrl }).eq("id", id);
    }
  }

  const handleOAuthLogin = async (provider: "google" | "facebook" | "github"): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/home`, 
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao fazer login:", error.message);
        alert("Erro ao fazer login: " + error.message);
      } else {
        console.error("Erro ao fazer login: An unknown error occurred.");
        alert("Erro ao fazer login: An unknown error occurred.");
      }
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("Usuário logado:", data.user);

      await handleUserSignIn(data.user);

      router.push("/home");
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-100 overflow-hidden">
      <div className="w-1/2 h-full flex relative">
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute left-0 w-full h-full flex flex-col justify-center items-center bg-gray-950 p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Sign In</h2>
          <form className="w-full max-w-md" onSubmit={handleSignIn}>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your email"
                required
              />
            </div>
            <InputPassword
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              label="Password"
              placeholder="Enter your Password"
              required
            />
            <div className="flex flex-col space-y-4 mt-4">
              <p className="text-white text-xs text-right ">
                Forgot Your Password?
                <Link href="/recover_password" className="text-blue-400 hover:text-blue-600 text-xs text-right ml-2">
                  Recover Password
                </Link>
              </p>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 w-full rounded focus:outline-none focus:shadow-outline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <p className="text-center text-gray-400 text-sm mt-4">
            Dont have an account?{" "}
            <Link href="/signup">
              <span className="text-blue-400 hover:text-blue-600">Sign up</span>
            </Link>
          </p>

          <div className="flex flex-col items-center mt-4 mb-10">
            <p className="text-gray-600 text-sm mb-2">Or sign up with</p>
            <div className="flex space-x-6">
              <div className="rounded-full cursor-pointer" onClick={() => handleOAuthLogin("google")}>
                <FcGoogle size={30} />
              </div>

              <div className="text-blue-600 rounded-full cursor-pointer" onClick={() => handleOAuthLogin("facebook")}>
                <FaFacebook size={30} />
              </div>

              <div className="text-white rounded-full cursor-pointer" onClick={() => handleOAuthLogin("github")}>
                <FaGithub size={30} />
              </div>
            </div>
          </div>

        </motion.div>
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center items-center text-white bg-cover bg-center overflow-hidden">
          <BackgroundImage />
        </div>
    </div>
  );
}

export default Signin;
