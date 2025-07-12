import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMapPin, FiTrendingUp, FiTrendingDown, FiMinus, FiAlertTriangle } = FiIcons;

const ViaAureliaSection = ({ data, hasData }) => {
  if (!hasData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Inserisci i dati per visualizzare l'analisi di Via Aurelia
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

  const aureliaData = {
    year1: data.year1.viaAurelia,
    year2: data.year2.viaAurelia
  };

  const getAureliaChartOption = () => ({
    title: {
      text: 'Incidenti Via Aurelia - Tipologie',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: [data.year1.year.toString(), data.year2.year.toString()],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: ['Tamponamento', 'Frontale/Laterale', 'Pedoni investiti']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: data.year1.year.toString(),
        type: 'bar',
        data: [
          aureliaData.year1.rearEnd,
          aureliaData.year1.frontal,
          aureliaData.year1.pedestrian
        ],
        itemStyle: {
          color: '#3b82f6'
        }
      },
      {
        name: data.year2.year.toString(),
        type: 'bar',
        data: [
          aureliaData.year2.rearEnd,
          aureliaData.year2.frontal,
          aureliaData.year2.pedestrian
        ],
        itemStyle: {
          color: '#ef4444'
        }
      }
    ]
  });

  const getPercentageOfTotal = (aureliaValue, totalValue) => {
    return totalValue > 0 ? ((aureliaValue / totalValue) * 100).toFixed(1) : 0;
  };

  const totalChange = calculateChange(aureliaData.year1.accidents, aureliaData.year2.accidents);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
          <SafeIcon icon={FiMapPin} className="text-primary-500" />
          <span>Analisi Via Aurelia</span>
        </h2>
        <p className="text-gray-600">
          Focus specifico sugli incidenti stradali in Via Aurelia
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Totale Incidenti</h3>
            <SafeIcon
              icon={getTrendIcon(totalChange.trend)}
              className={`text-2xl ${getTrendColor(totalChange.trend)}`}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{data.year1.year}:</span>
              <span className="font-bold">{aureliaData.year1.accidents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{data.year2.year}:</span>
              <span className="font-bold">{aureliaData.year2.accidents}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-sm">Variazione:</span>
                <span className={`font-bold ${getTrendColor(totalChange.trend)}`}>
                  {totalChange.change > 0 ? '+' : ''}{totalChange.change}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h3 className="font-semibold text-gray-900 mb-4">% sul Totale Città</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{data.year1.year}:</span>
              <span className="font-bold">
                {getPercentageOfTotal(aureliaData.year1.accidents, data.year1.totalAccidents)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{data.year2.year}:</span>
              <span className="font-bold">
                {getPercentageOfTotal(aureliaData.year2.accidents, data.year2.totalAccidents)}%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Tipologia Prevalente</h3>
          <div className="space-y-2">
            {[
              { label: 'Tamponamento', value: aureliaData.year2.rearEnd },
              { label: 'Frontale', value: aureliaData.year2.frontal },
              { label: 'Pedone', value: aureliaData.year2.pedestrian }
            ]
              .sort((a, b) => b.value - a.value)
              .slice(0, 2)
              .map((type, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{type.label}:</span>
                  <span className="font-bold">{type.value}</span>
                </div>
              ))}
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <ReactECharts
          option={getAureliaChartOption()}
          style={{ height: '400px' }}
          opts={{ renderer: 'canvas' }}
        />
      </motion.div>
    </div>
  );
};

export default ViaAureliaSection;