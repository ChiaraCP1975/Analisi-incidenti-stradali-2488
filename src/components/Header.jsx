import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiTrendingUp } = FiIcons;

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-lg border-b border-gray-200"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-500 p-3 rounded-lg">
              <SafeIcon icon={FiShield} className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Incidenti Stradali
              </h1>
              <p className="text-gray-600 mt-1">
                Analisi comparativa e monitoraggio della sicurezza stradale
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <SafeIcon icon={FiTrendingUp} className="text-2xl text-primary-500 mx-auto" />
              <p className="text-sm text-gray-600 mt-1">Analisi Trend</p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;