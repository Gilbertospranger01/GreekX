'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

function Sidewallet() {
  const [active, setActive] = useState('Dashboard');

  const menuItems = ['Dashboard', 'My Cards', 'Savings', 'Transactions', 'Statistics'];

  return (
    <motion.aside
      className="w-64 bg-gray-900 p-4 h-screen z-88 border-r border-gray-400"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`flex items-center gap-2 p-3 rounded-lg w-full cursor-pointer transition-colors ${
              active === item ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </motion.aside>
  );
}

export default Sidewallet;
