'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiUpload, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';
import supabase from '../../../utils/supabase';
import { useAuth } from '../../../hooks/useAuth';
import PhoneInput from '../../../components/phoneinput';

const Edit_Profile = () => {
    const router = useRouter();
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [userData, setUserData] = useState({
        username: '', name: '', email: '', nationality: '', phone: '',
        birthdate: '', gender: '', picture_url: ''
    });

    useEffect(() => {
        if (session === null) return;
        if (!session) router.push('/signin');
    }, [session, router]);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                console.error("Error fetching user:", error);
                setLoading(false);
                return;
            }

            // Buscar dados do perfil na tabela "profiles"
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error("Error fetching profile:", profileError.message);
                setLoading(false);
                return;
            }

            setUserData({
                username: profile.username || '',
                name: profile.name || '',
                email: user.email || '',
                nationality: profile.nationality || '',
                phone: profile.phone || '',
                birthdate: profile.birthdate || '',
                gender: profile.gender || '',
                picture_url: profile.picture_url || '',
            });

            setLoading(false);
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setLoading(true);

        // Verificar se o número de telefone já existe para outro usuário
        const { data: existingUser, error: phoneError } = await supabase
            .from('profiles')
            .select('id')
            .eq('phone', userData.phone)
            .neq('id', session?.user?.id) // Evitar conflito com o próprio usuário
            .single();

        if (phoneError && phoneError.code !== 'PGRST116') {
            console.error("Error checking phone:", phoneError.message);
            setLoading(false);
            return;
        }

        if (existingUser) {
            alert("Este número de telefone já está cadastrado para outro usuário.");
            setLoading(false);
            return;
        }

        // Atualizar os dados na tabela "profiles"
        const { error } = await supabase
            .from('profiles')
            .update({
                username: userData.username,
                name: userData.name,
                nationality: userData.nationality,
                phone: userData.phone,
                birthdate: userData.birthdate,
                gender: userData.gender,
                picture_url: userData.picture_url,
            })
            .eq('id', session?.user?.id);

        if (error) {
            console.error("Error updating profile:", error.message);
        } else {
            alert("Profile updated successfully!");
            router.push('/user/profile');
        }

        setLoading(false);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = event.target.files?.[0];
        if (!file) return;
        setImageUploading(true);

        const fileName = `${userData.username}-${Date.now()}.${file.name.split('.').pop()}`;
        const { data, error } = await supabase.storage
            .from('greekxs')
            .upload(`picture/${fileName}`, file, { upsert: true });

        if (!error) {
            const { data: publicUrlData } = supabase
                .storage
                .from('greekxs')
                .getPublicUrl(`picture/${fileName}`);

            if (publicUrlData) {
                setUserData(prev => ({ ...prev, picture_url: publicUrlData.publicUrl }));
            }
        }

        if (!error) {
            const { data } = supabase.storage.from('greekxs').getPublicUrl(`picture/${fileName}`);
            setUserData(prev => ({ ...prev, picture_url: data.publicUrl }));

        } else {
            console.error("Error uploading image:", error.message);
        }

        setImageUploading(false);
    };

    const handleRemovePicture = async () => {
        if (!userData.picture_url) return;

        setLoading(true);

        // Extrair o nome do arquivo do URL público
        const filePath = userData.picture_url.split('/').pop(); // Última parte do URL
        if (!filePath) {
            console.error("Erro ao obter o nome do arquivo.");
            setLoading(false);
            return;
        }

        // Remover do Supabase
        const { error } = await supabase.storage
            .from('greekxs') // Nome do bucket
            .remove([`picture/${filePath}`]); // Caminho no bucket

        if (error) {
            console.error("Erro ao remover a imagem:", error.message);
        } else {
            console.log("Imagem removida com sucesso!");
            setUserData(prev => ({ ...prev, picture_url: '' })); // Limpar o estado
        }

        setLoading(false);
    };


    if (!session) {
        return <div className='min-h-screen flex items-center justify-center bg-gray-950'><p className='text-white text-2xl animate-pulse'>Carregando...</p></div>;
    }

    return (
        <div className='min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white'>
            <div className='fixed top-0 left-0 w-full bg-gray-800 shadow-md py-3 px-6 flex items-center'>
                <button onClick={() => router.push('/user/profile')} className='text-gray-400 hover:text-white transition cursor-pointer'>
                    <FiArrowLeft size={24} />
                </button>
                <h1 className='ml-4 text-lg font-semibold'>Profile</h1>
            </div>
            <div className='w-full max-w-2xl mx-auto p-6 flex flex-col items-center justify-center min-h-screen pt-20'>
                <div className='flex flex-col items-center'>
                    {userData.picture_url ? (
                        <>
                            <Image
                                src={userData.picture_url}
                                alt="Profile"
                                width={128}
                                height={128}
                                className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg border-2 border-blue-600"
                            />
                            <button
                                onClick={handleRemovePicture}
                                className="mt-4 flex items-center text-sm text-red-500 hover:underline"
                            >
                                <FiTrash2 className="mr-1" /> Remove Picture
                            </button>
                        </>
                    ) : (
                        <div className="w-32 h-32 bg-gray-600 flex items-center justify-center rounded-full shadow-lg">
                            <span className="text-gray-400">No Picture</span>
                        </div>
                    )}
                    <label className='mt-4 flex items-center text-sm text-gray-300 cursor-pointer hover:text-white transition'>
                        <FiUpload className='mr-2' /> Upload Picture
                        <input type='file' accept='image/*' onChange={handleImageUpload} className='hidden' />
                    </label>
                </div>
                <div className='space-y-6 mt-8 w-full'>
                    <div>
                        <label htmlFor="username" className='block text-sm font-medium text-gray-300'>Username</label>
                        <input type="text" id="username" name="username" value={userData.username} onChange={handleInputChange} className='w-full px-4 py-2 mt-1 bg-gray-700 text-white border border-gray-600 rounded-lg' />
                    </div>
                    <div>
                        <label htmlFor="name" className='block text-sm font-medium text-gray-300'>Name</label>
                        <input type="text" id="name" name="name" value={userData.name} onChange={handleInputChange} className='w-full px-4 py-2 mt-1 bg-gray-700 text-white border border-gray-600 rounded-lg' />
                    </div>
                    <div>
                        <label htmlFor="email" className='block text-sm font-medium text-gray-400'>Email</label>
                        <input type="email" id="email" name="email" value={userData.email} disabled className='w-full px-4 py-2 bg-gray-600 text-gray-400 border border-gray-500 rounded-lg cursor-not-allowed' />
                    </div>
                    <div>
                        <label htmlFor="nationality" className='block text-sm font-medium text-gray-300'>Nationality</label>
                        <input type="text" id="nationality" name="nationality" value={userData.nationality} onChange={handleInputChange} className='w-full px-4 py-2 mt-1 bg-gray-700 text-white border border-gray-600 rounded-lg' />
                    </div>
                    <div>
                        <label htmlFor="phone" className='block text-sm font-medium text-gray-300'>Phone</label>
                        <PhoneInput
                            name="phone"
                            value={userData.phone}
                            onChange={(value) => setUserData(prev => ({ ...prev, phone: value }))}
                        />
                    </div>
                    <div>
                        <label htmlFor="birthdate" className='block text-sm font-medium text-gray-300'>Birthdate</label>
                        <input type="date" id="birthdate" name="birthdate" value={userData.birthdate} onChange={handleInputChange} className='w-full px-4 py-2 mt-1 bg-gray-700 text-white border border-gray-600 rounded-lg' />
                    </div>
                    <div>
                        <label htmlFor="gender" className='block text-sm font-medium text-gray-300'>Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={userData.gender}
                            onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                            className='w-full px-4 py-2 mt-1 bg-gray-700 text-white border border-gray-600 rounded-lg'
                        >
                            <option value="">Select Gender</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                        </select>
                    </div>
                    <button onClick={handleSave} disabled={loading || imageUploading} className='cursor-pointer w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50'>
                        {loading || imageUploading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Edit_Profile;