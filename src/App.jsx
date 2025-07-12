import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DataInputForm from './components/DataInputForm';
import ComparisonCharts from './components/ComparisonCharts';
import SummarySection from './components/SummarySection';
import ViaAureliaSection from './components/ViaAureliaSection';
import ReportExport from './components/ReportExport';
import Header from './components/Header';

function App() {
  const [data, setData] = useState({
    year1: {
      year: new Date().getFullYear() - 1,
      totalAccidents: 0,
      totalInjured: 0,
      rearEnd: 0,
      frontal: 0,
      pedestrian: 0,
      viaAurelia: {
        accidents: 0,
        rearEnd: 0,
        frontal: 0,
        pedestrian: 0
      }
    },
    year2: {
      year: new Date().getFullYear(),
      totalAccidents: 0,
      totalInjured: 0,
      rearEnd: 0,
      frontal: 0,
      pedestrian: 0,
      viaAurelia: {
        accidents: 0,
        rearEnd: 0,
        frontal: 0,
        pedestrian: 0
      }
    }
  });

  const [activeTab, setActiveTab] = useState('input');

  const handleDataUpdate = (yearKey, newData) => {
    setData(prev => ({
      ...prev,
      [yearKey]: newData
    }));
  };

  const hasData = () => {
    return data.year1.totalAccidents > 0 || data.year2.totalAccidents > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border">
            {[
              { id: 'input', label: 'Inserimento Dati', icon: '📊' },
              { id: 'charts', label: 'Grafici Comparativi', icon: '📈' },
              { id: 'summary', label: 'Sintesi', icon: '📋' },
              { id: 'aurelia', label: 'Via Aurelia', icon: '🛣️' },
              { id: 'export', label: 'Esporta Report', icon: '📄' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'input' && (
            <DataInputForm data={data} onDataUpdate={handleDataUpdate} />
          )}
          
          {activeTab === 'charts' && (
            <ComparisonCharts data={data} hasData={hasData()} />
          )}
          
          {activeTab === 'summary' && (
            <SummarySection data={data} hasData={hasData()} />
          )}
          
          {activeTab === 'aurelia' && (
            <ViaAureliaSection data={data} hasData={hasData()} />
          )}
          
          {activeTab === 'export' && (
            <ReportExport data={data} hasData={hasData()} />
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default App;