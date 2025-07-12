import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUsers, FiAlertTriangle, FiTrash2 } = FiIcons;

const DataInputForm = ({ data, onDataUpdate }) => {
  const inputRefs = useRef({});

  const handleInputChange = (yearKey, field, value, subField = null) => {
    // Convertiamo in numero solo se c'è un valore
    const numValue = value === '' ? 0 : parseInt(value, 10);

    // Aggiorna i dati
    if (subField) {
      onDataUpdate(yearKey, {
        ...data[yearKey],
        [field]: {
          ...data[yearKey][field],
          [subField]: numValue
        }
      });
    } else {
      onDataUpdate(yearKey, {
        ...data[yearKey],
        [field]: numValue
      });
    }
  };

  const clearAllData = () => {
    if (window.confirm('Sei sicuro di voler cancellare tutti i dati inseriti?')) {
      const emptyData = {
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
      };
      onDataUpdate('year1', emptyData.year1);
      onDataUpdate('year2', emptyData.year2);
    }
  };

  const InputField = ({ label, value, onChange, icon, placeholder = "0", id }) => (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
        <SafeIcon icon={icon} className="text-primary-500" />
        <span>{label}</span>
      </label>
      <input
        ref={(el) => inputRefs.current[id] = el}
        type="number"
        min="0"
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          // Permettiamo valori vuoti e numeri
          if (val === '' || /^\d*$/.test(val)) {
            onChange(val);
          }
        }}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-lg"
      />
    </div>
  );

  const getFieldsConfig = (yearKey) => {
    const mainFields = [
      { id: `${yearKey}-year`, label: 'Anno', field: 'year', icon: FiCalendar, placeholder: '2024' },
      { id: `${yearKey}-totalAccidents`, label: 'Numero totale incidenti', field: 'totalAccidents', icon: FiAlertTriangle },
      { id: `${yearKey}-totalInjured`, label: 'Numero totale feriti', field: 'totalInjured', icon: FiUsers },
      { id: `${yearKey}-rearEnd`, label: 'Tamponamento', field: 'rearEnd', icon: FiAlertTriangle },
      { id: `${yearKey}-frontal`, label: 'Frontale / Frontale laterale', field: 'frontal', icon: FiAlertTriangle },
      { id: `${yearKey}-pedestrian`, label: 'Pedoni investiti', field: 'pedestrian', icon: FiUsers }
    ];

    const aureliaFields = [
      { id: `${yearKey}-viaAurelia-accidents`, label: 'Incidenti su Via Aurelia', field: 'viaAurelia', subField: 'accidents', icon: FiAlertTriangle },
      { id: `${yearKey}-viaAurelia-rearEnd`, label: 'Tamponamento (Via Aurelia)', field: 'viaAurelia', subField: 'rearEnd', icon: FiAlertTriangle },
      { id: `${yearKey}-viaAurelia-frontal`, label: 'Frontale (Via Aurelia)', field: 'viaAurelia', subField: 'frontal', icon: FiAlertTriangle },
      { id: `${yearKey}-viaAurelia-pedestrian`, label: 'Pedoni investiti (Via Aurelia)', field: 'viaAurelia', subField: 'pedestrian', icon: FiUsers }
    ];

    return { mainFields, aureliaFields };
  };

  const YearSection = ({ yearKey, yearData, title, fieldsConfig }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <SafeIcon icon={FiCalendar} className="text-primary-500" />
        <span>{title}</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsConfig.mainFields.map((fieldInfo) => (
          <InputField
            key={fieldInfo.id}
            id={fieldInfo.id}
            label={fieldInfo.label}
            value={yearData[fieldInfo.field]}
            onChange={(value) => handleInputChange(yearKey, fieldInfo.field, value)}
            icon={fieldInfo.icon}
            placeholder={fieldInfo.placeholder}
          />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Via Aurelia</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldsConfig.aureliaFields.map((fieldInfo) => (
            <InputField
              key={fieldInfo.id}
              id={fieldInfo.id}
              label={fieldInfo.label}
              value={yearData[fieldInfo.field][fieldInfo.subField]}
              onChange={(value) => handleInputChange(yearKey, fieldInfo.field, value, fieldInfo.subField)}
              icon={fieldInfo.icon}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Inserimento Dati Incidenti Stradali
        </h2>
        <p className="text-gray-600">
          Inserisci i dati per confrontare due anni diversi
        </p>

        {/* Clear All Button */}
        <div className="mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllData}
            className="flex items-center justify-center space-x-2 bg-danger-500 text-white px-6 py-3 rounded-lg hover:bg-danger-600 transition-colors mx-auto"
          >
            <SafeIcon icon={FiTrash2} />
            <span>Pulisci tutti i campi</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <YearSection
          yearKey="year1"
          yearData={data.year1}
          title="Primo Anno"
          fieldsConfig={getFieldsConfig('year1')}
        />
        <YearSection
          yearKey="year2"
          yearData={data.year2}
          title="Secondo Anno"
          fieldsConfig={getFieldsConfig('year2')}
        />
      </div>
    </div>
  );
};

export default DataInputForm;