'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import Image from 'next/image';
import supabase from '../../../utils/supabase';
import { useAuth } from '../../../hooks/useAuth';

const Profile = () => {
    const router = useRouter();
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        username: '', name: '', email: '', nationality: '', phone: '',
        birthdate: '', gender: '', picture_url: ''
    });

    const navigate = (path: string) => {
        router.push(path);
    };

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

            // Formatar data de nascimento
            const formatDate = (dateString: string) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toLocaleDateString('pt-BR'); // Formato dd/mm/yyyy
            };

            setUserData({
                username: profile.username || '',
                name: profile.name || '',
                email: user.email || '',
                nationality: profile.nationality || '',
                phone: profile.phone || '',
                birthdate: formatDate(profile.birthdate), // Formata aqui
                gender: profile.gender || '',
                picture_url: profile.picture_url || '',
            });
            console.log(loading);
            setLoading(false);
        };

        fetchUserData();
    }, [loading]);

    if (!session) {
        return <div className='min-h-screen flex items-center justify-center bg-gray-950'><p className='text-white text-2xl animate-pulse'>Carregando...</p></div>;
    }

    return (
        <div className='min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white'>
            <div className='fixed top-0 left-0 w-full bg-gray-800 shadow-md py-3 px-6 flex items-center'>
                <button onClick={() => router.push('/home')} className='text-gray-400 hover:text-white transition cursor-pointer'>
                    <FiArrowLeft size={24} />
                </button>
                <h1 className='ml-4 text-lg font-semibold'>Profile</h1>
            </div>
            <div className='w-full max-w-2xl mx-auto p-6 flex flex-col items-center justify-center min-h-screen pt-20'>
                <div className='flex flex-col items-center'>
                    {userData.picture_url ? (
                        <Image
                            src={userData.picture_url}
                            alt="Profile"
                            width={128}
                            height={128}
                            className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg border-2 border-blue-600"
                        />
                    ) : (
                        <div className="w-32 h-32 bg-gray-600 flex items-center justify-center rounded-full shadow-lg">
                            <span className="text-gray-400">No Picture</span>
                        </div>
                    )}
                </div>
                <div className='space-y-6 mt-8 w-full'>
                    <div>
                        <label className='block text-sm font-medium text-gray-300'>Username</label>
                        <p className='w-full px-4 py-3 bg-gray-700 text-gray-400 border border-gray-500 rounded-lg'>{userData.username}</p>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-300'>Name</label>
                        <p className='w-full px-4 py-3 bg-gray-700 text-gray-400 border border-gray-500 rounded-lg'>{userData.name}</p>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-300'>Email</label>
                        <p className='w-full px-4 py-3 bg-gray-700 text-gray-400 border border-gray-500 rounded-lg'>{userData.email}</p>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-300'>Nationality</label>
                        <p className='w-full px-4 py-3 bg-gray-700 text-gray-400 border border-gray-500 rounded-lg'>{userData.nationality}</p>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-300'>Phone</label>
                        <p className='w-full px-4 py-3 bg-gray-700 text-gray-400 border border-gray-500 rounded-lg'>{userData.phone}</p>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-300'>Gender</label>
                        <p className='w-full px-4 py-3 bg-gray-700 text-gray-400 border border-gray-500 rounded-lg'>{userData.gender}</p>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-300'>Birthdate</label>
                        <p className='w-full px-4 py-3 bg-gray-700 text-gray-400 border border-gray-500 rounded-lg'>{userData.birthdate}</p>
                    </div>
                    <button onClick={() => navigate("/user/edit_profile")} className='cursor-pointer w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50'>
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
