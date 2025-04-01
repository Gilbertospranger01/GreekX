'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiArrowUpRight, FiSend, FiMenu, FiX } from 'react-icons/fi';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import supabase from '../../utils/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import Sidewallet from '../../components/sidewallet';
import Image from 'next/image';
import { JSX } from 'react/jsx-dev-runtime';
import { BiMoneyWithdraw } from 'react-icons/bi';

interface Transaction {
  id: number;
  amount: number;
  created_at: string;
  type: string;
  status: 'pending' | 'completed' | 'failed';
}

const Wallet = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sidewalletOpen, setSidewalletOpen] = useState(false);
  const { session } = useAuth();
  const router = useRouter();

  const user = useMemo(() => {
    if (!session?.user) return null;
    return {
      id: session.user.id,
      name: session.user.user_metadata?.name || 'User',
      picture: session.user.user_metadata?.avatar_url || null,
    };
  }, [session]);

  useEffect(() => {
    if (!user) return;

    const fetchWalletData = async () => {
      try {
        const { data, error } = await supabase
          .from('wallets')
          .select('id, balance, wallet_transactions(*)')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!data) return;

        setBalance(data.balance || 0);
        setTransactions(data.wallet_transactions || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchWalletData();
  }, [user]);

  const handleNavigation = (path: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(path);
  };

  return (
    <div >
      <motion.div className="flex min-h-screen bg-gray-900 text-white relative overflow-hidden">
        {/* Sidebar */}
        <motion.div
          className={`border-r border-gray-400 fixed left-0 top-0 h-full w-64 bg-gray-800 shadow-lg transform ${sidewalletOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300`}
        >
          <div className="flex justify-between items-center p-9 bg-gray-800 h-16">
            <button onClick={() => setSidewalletOpen(false)}>
              <FiX size={24} className="text-white cursor-pointer" />
            </button>
          </div>
          <Sidewallet />
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 w-full ml-0">
          <header className="flex w-full justify-between items-center p-4 bg-gray-800 shadow-md">
            <button onClick={() => setSidewalletOpen((prev) => !prev)} className='cursor-pointer'>
              <FiMenu size={24} className="text-white" />
            </button>
            <div className="text-2xl font-bold">GreekX</div>
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm">{user.name}</span>
                {user.picture && (
                  <Image
                    src={user.picture}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
              </div>
            )}
          </header>

          <main className="p-4">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-3 w-535">
              <motion.div className="md:col-span-1 bg-gray-800 p-4 rounded-xl">
                <h2 className="text-md text-gray-300">Available Amount</h2>
                <motion.p className="text-2xl font-semibold mt-2">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(balance)}
                </motion.p>
              </motion.div>

              <motion.div className="md:col-span-2 bg-gray-800 p-8 rounded-xl space-y-4 w-150">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <div className='flex gap-4'>
                <QuickActionButton icon={<FiPlus />} label="Top up" onClick={() => handleNavigation('/addmoney')} />
                <QuickActionButton icon={<BiMoneyWithdraw />} label="Withdraw" />
                </div>
                <div className='flex gap-4'>
                <QuickActionButton icon={<FiSend />} label="Send" />
                <QuickActionButton icon={<FiPlus />} label="Express" />
                </div>
                <div className='flex gap-4'>
                <QuickActionButton icon={<FiArrowUpRight />} label="Pay" />
                <QuickActionButton icon={<FiPlus />} label="Visa" onClick={() => handleNavigation('/visa')}/>
                </div>
              </motion.div>
            </section>
            <div className="flex justify-end w-full">
              <motion.div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-8 w-150 max-h-100 overflow-y-scroll scrollbar-none">
                <h2 className="text-xl font-semibold mb-4">Transactions</h2>
                {transactions.length === 0 ? (
                  <p className="text-gray-400">No transactions yet</p>
                ) : (
                  transactions.map((txn) => (
                    <TransactionItem key={txn.id} txn={txn} />
                  ))
                )}
              </motion.div>
            </div>

          </main>
        </div>
      </motion.div>
    </div>
  );
};

const QuickActionButton = ({ icon, label, onClick }: { icon: JSX.Element; label: string; onClick?: () => void }) => (
  <button className="flex items-center gap-2 bg-green-500 hover:bg-green-700 p-3 rounded-lg w-full cursor-pointer" onClick={onClick}>
    {icon} {label}
  </button>
);

const TransactionItem = ({ txn }: { txn: Transaction }) => {
  const getStatusIcon = () => {
    switch (txn.status) {
      case 'completed':
        return <FaCheckCircle className="text-green-400" />;
      case 'pending':
        return <FaClock className="text-yellow-400" />;
      case 'failed':
        return <FaTimesCircle className="text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <motion.div className="flex justify-between items-center p-3 bg-gray-950 rounded-lg mb-2 cursor-pointer">
      <div>
        <span className="block font-semibold">{txn.type}</span>
        <span className="text-xs text-gray-400">
          {new Date(txn.created_at).toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className={txn.amount > 0 ? 'text-green-400' : 'text-red-400'}>
          {txn.amount > 0 ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
        </span>
      </div>
    </motion.div>
  );
};

export default Wallet;
