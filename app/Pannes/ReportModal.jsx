import React, { useState } from 'react';

const ReportModal = ({ isOpen, onClose, onSubmit, action, formData, setFormData }) => {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass the full formData object
    setFormData({ report: '', remarque: '' }); // Reset form data after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center text-black justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="font-semibold mb-4">Rapport de Panne - {action}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            name="report"
            value={formData.report}
            onChange={handleChange}
            placeholder="Entrez votre rapport ici..."
            className="w-full h-32 p-2 border border-gray-300 rounded mb-4"
            required
          />
          <textarea
            name="remarque"
            value={formData.remarque}
            onChange={handleChange}
            placeholder="Entrez votre remarque ici..."
            className="w-full h-32 p-2 border border-gray-300 rounded mb-4"
            required
          />
          <div className="flex text-base justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black p-2 rounded mr-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded"
            >
              Soumettre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
