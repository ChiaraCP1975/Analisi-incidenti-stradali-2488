import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTrendingDown, FiMinus, FiAlertTriangle, FiUsers, FiTarget } = FiIcons;

const SummarySection = ({ data, hasData }) => {
  if (!hasData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Inserisci i dati per visualizzare la sintesi
        </p>
      </div>
    );
  }

  const calculateChange = (value1, value2) => {
    const change = value2 - value1;
    const percentage = value1 > 0 ? ((change / value1) * 100).toFixed(1) : 0;
    return {
      change,
      percentage,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'same'
    };
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return FiTrendingUp;
      case 'down': return FiTrendingDown;
      default: return FiMinus;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-danger-500';
      case 'down': return 'text-success-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendBgColor = (trend) => {
    switch (trend) {
      case 'up': return 'bg-danger-50 border-danger-200';
      case 'down': return 'bg-success-50 border-success-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const metrics = [
    {
      label: 'Totale Incidenti',
      icon: FiAlertTriangle,
      year1: data.year1.totalAccidents,
      year2: data.year2.totalAccidents
    },
    {
      label: 'Totale Feriti',
      icon: FiUsers,
      year1: data.year1.totalInjured,
      year2: data.year2.totalInjured
    },
    {
      label: 'Tamponamento',
      icon: FiTarget,
      year1: data.year1.rearEnd,
      year2: data.year2.rearEnd
    },
    {
      label: 'Frontale/Laterale',
      icon: FiTarget,
      year1: data.year1.frontal,
      year2: data.year2.frontal
    },
    {
      label: 'Pedoni investiti',
      icon: FiUsers,
      year1: data.year1.pedestrian,
      year2: data.year2.pedestrian
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sintesi Comparativa
        </h2>
        <p className="text-gray-600">
          Analisi dei cambiamenti tra {data.year1.year} e {data.year2.year}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const analysis = calculateChange(metric.year1, metric.year2);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg p-6 border-2 ${getTrendBgColor(analysis.trend)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={metric.icon} className="text-2xl text-gray-600" />
                  <h3 className="font-semibold text-gray-900">{metric.label}</h3>
                </div>
                <SafeIcon
                  icon={getTrendIcon(analysis.trend)}
                  className={`text-2xl ${getTrendColor(analysis.trend)}`}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{data.year1.year}:</span>
                  <span className="font-bold text-lg">{metric.year1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{data.year2.year}:</span>
                  <span className="font-bold text-lg">{metric.year2}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Variazione:</span>
                    <div className="text-right">
                      <div className={`font-bold ${getTrendColor(analysis.trend)}`}>
                        {analysis.change > 0 ? '+' : ''}{analysis.change}
                      </div>
                      {analysis.percentage !== '0' && (
                        <div className={`text-sm ${getTrendColor(analysis.trend)}`}>
                          ({analysis.percentage > 0 ? '+' : ''}{analysis.percentage}%)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Riepilogo Generale</h3>
        <div className="space-y-3 text-gray-700">
          {metrics.map((metric, index) => {
            const analysis = calculateChange(metric.year1, metric.year2);
            if (analysis.trend === 'same') return null;
            return (
              <p key={index} className="flex items-center space-x-2">
                <SafeIcon
                  icon={getTrendIcon(analysis.trend)}
                  className={`${getTrendColor(analysis.trend)}`}
                />
                <span>
                  <strong>{metric.label}</strong> è {analysis.trend === 'up' ? 'aumentato' : 'diminuito'} di {Math.abs(analysis.change)} unità
                  {analysis.percentage !== '0' && ` (${Math.abs(analysis.percentage)}%)`}
                </span>
              </p>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default SummarySection;