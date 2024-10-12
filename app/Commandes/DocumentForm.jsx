import React, { use, useState, useEffect } from 'react';

const CommandModal = ({ isOpen, onClose, onSubmit, session }) => {
  const [items, setItems] = useState([]);
  const [currentProductType, setCurrentProductType] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [types, setTypes] = useState([]);

  const handleAddItem = () => {
    if (currentProductType && currentQuantity) {
      const newItem = { itemType: currentProductType, quantity: currentQuantity };
      setItems([...items, newItem]);
      setCurrentProductType('');
      setCurrentQuantity('');
    }
  };

  const handleSubmit = () => {
    if (items.length > 0) {
      onSubmit(items);
      setItems([]);
      onClose();
    }
  };

  useEffect(() => {
    const getTypes = async () => {
      const response = await fetch('http://localhost:8080/api/types', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        cache: 'no-cache',
      });
      if (response.ok) {
        const data = await response.json();
        setTypes(data);
        console.log('Types:', data);
      }
    }
    getTypes();
  }
  , [session]);


  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-5 text-black">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white p-8 rounded shadow-lg z-10 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Nouvelle Commande</h2>

        {items.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium">Added Items:</h3>
            {items.map((item, index) => (
              <p key={index}>
                {item.itemType} - {item.quantity}
              </p>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
        <div className="mb-4">

          <select
            value={currentProductType}
            onChange={(e) => setCurrentProductType(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          >
            <option value="">Choisir un produit</option>
            {types.map((type, index) => (
              <option key={index} value={type.itemType}>
                {type.itemType}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            value={currentQuantity}
            onChange={(e) => setCurrentQuantity(e.target.value)}
            placeholder="Quantite"
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Ajouter Materiel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-emerald-600 text-white bg-green-600 p-2 rounded hover:bg-emerald-700 transition duration-300"
          >
            Valider Commande
          </button>
        </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default CommandModal;
