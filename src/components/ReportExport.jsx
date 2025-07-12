import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';
import SafeIcon from '../common/SafeIcon';
import ReactECharts from 'echarts-for-react';
import * as FiIcons from 'react-icons/fi';

const { FiPrinter, FiFileText } = FiIcons;

const ReportExport = ({ data, hasData }) => {
  const reportRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
  });

  const exportToPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`report-incidenti-${data.year1.year}-${data.year2.year}.pdf`);
  };

  if (!hasData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Inserisci i dati per generare ed esportare il report
        </p>
      </div>
    );
  }

  // Funzioni per generare le opzioni dei grafici
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

  const getTotalAccidentsOption = () => ({
    title: {
      text: 'Totale Incidenti',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b0}: {c0}'
    },
    xAxis: {
      type: 'category',
      data: [data.year1.year.toString(), data.year2.year.toString()]
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [
          {
            value: data.year1.totalAccidents,
            itemStyle: { color: '#3b82f6' }
          },
          {
            value: data.year2.totalAccidents,
            itemStyle: { color: '#ef4444' }
          }
        ],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  });

  const getAureliaChartOption = () => ({
    title: {
      text: 'Via Aurelia - Dettaglio',
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
          data.year1.viaAurelia.rearEnd,
          data.year1.viaAurelia.frontal,
          data.year1.viaAurelia.pedestrian
        ],
        itemStyle: {
          color: '#3b82f6'
        }
      },
      {
        name: data.year2.year.toString(),
        type: 'bar',
        data: [
          data.year2.viaAurelia.rearEnd,
          data.year2.viaAurelia.frontal,
          data.year2.viaAurelia.pedestrian
        ],
        itemStyle: {
          color: '#ef4444'
        }
      }
    ]
  });

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Esporta Report
        </h2>
        <p className="text-gray-600">
          Scarica o stampa l'analisi degli incidenti stradali
        </p>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToPDF}
          className="flex items-center justify-center space-x-2 bg-danger-500 text-white px-8 py-4 rounded-lg hover:bg-danger-600 transition-colors text-lg"
        >
          <SafeIcon icon={FiFileText} className="text-xl" />
          <span>Scarica PDF</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="flex items-center justify-center space-x-2 bg-primary-500 text-white px-8 py-4 rounded-lg hover:bg-primary-600 transition-colors text-lg"
        >
          <SafeIcon icon={FiPrinter} className="text-xl" />
          <span>Stampa</span>
        </motion.button>
      </div>

      {/* Report Preview */}
      <div ref={reportRef} className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Report Incidenti Stradali
          </h1>
          <p className="text-gray-600">
            Analisi comparativa {data.year1.year} - {data.year2.year}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Generato il {new Date().toLocaleDateString('it-IT')}
          </p>
        </div>

        {/* Total Accidents Chart */}
        <div className="mb-8">
          <div className="h-[350px]">
            <ReactECharts
              option={getTotalAccidentsOption()}
              style={{ height: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>

        {/* Summary Table */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Riepilogo Generale</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Categoria</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">{data.year1.year}</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">{data.year2.year}</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Variazione</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">%</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Totale Incidenti', key: 'totalAccidents' },
                  { label: 'Totale Feriti', key: 'totalInjured' },
                  { label: 'Tamponamento', key: 'rearEnd' },
                  { label: 'Frontale/Laterale', key: 'frontal' },
                  { label: 'Pedoni investiti', key: 'pedestrian' }
                ].map((item, index) => {
                  const value1 = data.year1[item.key];
                  const value2 = data.year2[item.key];
                  const change = value2 - value1;
                  const percentage = value1 > 0 ? ((change / value1) * 100).toFixed(1) : 0;
                  return (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{item.label}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{value1}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{value2}</td>
                      <td className={`border border-gray-300 px-4 py-2 text-center font-bold ${
                        change > 0 ? 'text-red-600' : change < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {change > 0 ? '+' : ''}{change}
                      </td>
                      <td className={`border border-gray-300 px-4 py-2 text-center ${
                        change > 0 ? 'text-red-600' : change < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {percentage !== '0' ? `${percentage > 0 ? '+' : ''}${percentage}%` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Accident Types Chart */}
        <div className="mb-8">
          <div className="h-[350px]">
            <ReactECharts
              option={getAccidentTypesOption()}
              style={{ height: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>

        {/* Via Aurelia Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Via Aurelia - Analisi Dettagliata</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Tipologia</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">{data.year1.year}</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">{data.year2.year}</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Variazione</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Totale Incidenti', key: 'accidents' },
                  { label: 'Tamponamento', key: 'rearEnd' },
                  { label: 'Frontale/Laterale', key: 'frontal' },
                  { label: 'Pedoni investiti', key: 'pedestrian' }
                ].map((item, index) => {
                  const value1 = data.year1.viaAurelia[item.key];
                  const value2 = data.year2.viaAurelia[item.key];
                  const change = value2 - value1;
                  return (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{item.label}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{value1}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{value2}</td>
                      <td className={`border border-gray-300 px-4 py-2 text-center font-bold ${
                        change > 0 ? 'text-red-600' : change < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {change > 0 ? '+' : ''}{change}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Via Aurelia Chart */}
        <div className="mb-8">
          <div className="h-[350px]">
            <ReactECharts
              option={getAureliaChartOption()}
              style={{ height: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>

        {/* Key Insights */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Considerazioni Principali</h2>
          <div className="space-y-2 text-gray-700">
            <p>• Il numero totale di incidenti è {data.year2.totalAccidents > data.year1.totalAccidents ? 'aumentato' : 'diminuito'} di {Math.abs(data.year2.totalAccidents - data.year1.totalAccidents)} unità</p>
            <p>• Via Aurelia rappresenta il {data.year2.totalAccidents > 0 ? ((data.year2.viaAurelia.accidents / data.year2.totalAccidents) * 100).toFixed(1) : 0}% degli incidenti totali nel {data.year2.year}</p>
            <p>• La tipologia di incidente più frequente nel {data.year2.year} è: {[
              { name: 'Tamponamento', value: data.year2.rearEnd },
              { name: 'Frontale/Laterale', value: data.year2.frontal },
              { name: 'Pedoni investiti', value: data.year2.pedestrian }
            ].sort((a, b) => b.value - a.value)[0].name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportExport;