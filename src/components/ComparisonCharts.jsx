import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';

const ComparisonCharts = ({ data, hasData }) => {
  if (!hasData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Inserisci i dati per visualizzare i grafici comparativi
        </p>
      </div>
    );
  }

  const getBarChartOption = (title, dataKey, color) => ({
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        return params.map(param => 
          `${param.seriesName}: ${param.value}`
        ).join('<br/>');
      }
    },
    legend: {
      data: [data.year1.year.toString(), data.year2.year.toString()],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: [title]
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: data.year1.year.toString(),
        type: 'bar',
        data: [data.year1[dataKey]],
        itemStyle: {
          color: color[0]
        }
      },
      {
        name: data.year2.year.toString(),
        type: 'bar',
        data: [data.year2[dataKey]],
        itemStyle: {
          color: color[1]
        }
      }
    ]
  });

  const getAccidentTypesOption = () => ({
    title: {
      text: 'Tipologie di Incidenti - Confronto',
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
        data: [data.year1.rearEnd, data.year1.frontal, data.year1.pedestrian],
        itemStyle: {
          color: '#3b82f6'
        }
      },
      {
        name: data.year2.year.toString(),
        type: 'bar',
        data: [data.year2.rearEnd, data.year2.frontal, data.year2.pedestrian],
        itemStyle: {
          color: '#ef4444'
        }
      }
    ]
  });

  const charts = [
    {
      title: 'Totale Incidenti',
      option: getBarChartOption('Totale Incidenti', 'totalAccidents', ['#3b82f6', '#ef4444'])
    },
    {
      title: 'Totale Feriti',
      option: getBarChartOption('Totale Feriti', 'totalInjured', ['#22c55e', '#f59e0b'])
    },
    {
      title: 'Tipologie di Incidenti',
      option: getAccidentTypesOption()
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Grafici Comparativi
        </h2>
        <p className="text-gray-600">
          Confronto dei dati tra {data.year1.year} e {data.year2.year}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <ReactECharts
              option={chart.option}
              style={{ height: '350px' }}
              opts={{ renderer: 'canvas' }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonCharts;