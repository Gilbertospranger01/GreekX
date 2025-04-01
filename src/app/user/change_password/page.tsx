"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../utils/supabase";
import InputPassword from "../../../components/input-password";

const ChangePassword = () => {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSocialLogin, setIsSocialLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoginMethod = async () => {
            setLoading(true);
            setError("");

            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                setError("Erro ao obter os dados do usuário.");
                setLoading(false);
                return;
            }

            // Verifica se o usuário está logado com um provedor social
            const socialProviders = ["google", "facebook", "github"];
            const hasSocialLogin: boolean = Array.isArray(user.app_metadata.providers) 
                ? user.app_metadata.providers.some((provider: string) => socialProviders.includes(provider)) 
                : false;
            console.log("Usuário fez login com provedor social?", hasSocialLogin);

            setIsSocialLogin(hasSocialLogin);
            setLoading(false);
        };

        checkUserLoginMethod();
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("A nova senha e a confirmação não correspondem.");
            return;
        }

        try {
            if (!isSocialLogin) {
                // Verifica se a senha atual está correta
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: (await supabase.auth.getUser()).data.user?.email || "",
                    password: currentPassword,
                });

                if (signInError) {
                    setError("Senha atual incorreta.");
                    return;
                }
            }

            // Atualiza ou define a senha
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) {
                setError(updateError.message);
                return;
            }

            setSuccess(isSocialLogin ? "Senha definida com sucesso! Faça login novamente." : "Senha atualizada com sucesso! Faça login novamente.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            await supabase.auth.signOut();
            router.push("/signin");
        } catch (err) {
            setError("Ocorreu um erro inesperado.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-gray-600 rounded shadow-md">
                <h1 className="mb-6 text-2xl font-bold text-center">{isSocialLogin ? "Definir Senha" : "Alterar Senha"}</h1>
                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                {success && <p className="mb-4 text-sm text-green-500">{success}</p>}
                {loading ? (
                    <p className="text-center text-gray-500">Carregando...</p>
                ) : (
                    <form onSubmit={handleChangePassword}>
                        {!isSocialLogin && (
                            <div className="mb-4">
                                <label htmlFor="currentPassword" className="block mb-2 text-sm font-medium text-gray-700">
                                    Senha Atual
                                </label>
                                <InputPassword
                                    name="currentPassword"
                                    label="Senha Atual"
                                    placeholder="Digite sua senha atual"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-700">
                                Nova Senha
                            </label>
                            <InputPassword
                                name="newPassword"
                                label="Nova Senha"
                                placeholder="Crie sua nova senha"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
                                Confirmar Nova Senha
                            </label>
                            <InputPassword
                                name="confirmPassword"
                                label="Confirmar Senha"
                                placeholder="Confirme sua nova senha"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            {isSocialLogin ? "Definir Senha" : "Atualizar Senha"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChangePassword;
