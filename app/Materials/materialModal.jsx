'use client';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; // Import PapaParse for CSV parsing
import Alert from '../component/Alert';
import { set } from 'lodash';
import { setRef } from '@mui/material';

const ProductModal = ({ isOpen, onClose, session }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [types, setTypes] = useState([]);
  const [quantity, setQuantity] = useState(0); 
  const [inventoryId, setInventoryId] = useState(''); // Single inventory ID input
  const [inventoryIds, setInventoryIds] = useState([]); // List of inventory IDs
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [inventoryIdInputDisabled, setInventoryIdInputDisabled] = useState(true); // Disable ID input until quantity is entered
  const [inventories, setInventories] = useState([]);  // Handle single product submission
  const [isOpened, setIsOpened] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [isRefresh, setIsRefresh] = useState(false);
  const handleSingleProductSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      itemType: event.target["typeItem"].value,
      nref: event.target["itemRef"].value,
      marque: event.target["marque"].value,
      description: event.target["description"].value,
      entryId: event.target["entryId"].value,
      quantity: event.target["quantity"].value,
      minQuantity: event.target["minQuantity"].value,
      etat: event.target["etat"].value, 
      inventoryIds: inventoryIds, // Send inventory IDs array
      insertedBy: session?.user?.id,
    };
    
  

    try {
      const response = await fetch('http://localhost:8080/api/Inventory/requestItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(dataToSend),
      });
      // Check if the response content-type is JSON
      const contentType = response.headers.get('Content-Type');

      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json(); // Parse as JSON
      } else {
        data = await response.text(); // Parse as plain text
      }

      if (!response.ok) {
        throw new Error(`Error: ${data}`);
      }
      setMessage('Produit ajouté avec succès');
      setTitle('Ajout de produit');
      setType('success');
      setIsOpened(true);
      setIsRefresh(true);

      // console.log('Product successfully added:', data);
      // window.location.reload();  // Force a hard refresh of the entire page
    } catch (err) {
      setMessage('Erreur lors de l\'ajout de produit');
      setTitle('Ajout de produit');
      setType('alert');
      setIsOpened(true);
      console.error('Failed to submit product:', err.message);
    }
};

  // Handle CSV import
  const handleCsvImport = async (event) => {
    event.preventDefault();
    if (!csvFile) {
      console.error('No CSV file selected');
      return;
    }

    Papa.parse(csvFile, {
      complete: async (result) => {
        const data = result.data;
        try {
          const response = await fetch('http://localhost:8080/api/Item/saveMany', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(data), // Send the parsed CSV data to the backend
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.message}`);
          }
          const responseData = await response.json();
          console.log('Batch insert successful:', responseData);
        } catch (err) {
          console.error('Failed to import CSV:', err.message);
        }
      },
      header: true, // Assuming the CSV file has a header row
    });
  };

  // Fetch types
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
  };

  useEffect(() => {
    getTypes();
  }, [session]);

  // Handle quantity input and toggle inventory ID input field
  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);
    setInventoryIdInputDisabled(newQuantity === 0); // Enable ID input if quantity > 0
  };

  // Handle adding inventory ID with duplicate check
  const handleAddInventoryId = () => {
    if (inventoryId.trim() && !inventoryIds.includes(inventoryId) && inventoryIds.length < quantity) {
      setInventoryIds([...inventoryIds, inventoryId]);
      setInventoryId(''); // Clear the input after adding
    } else if (inventoryIds.includes(inventoryId)) {
      setIsOpened(true);
      setMessage('ID d\'inventaire en double');
      setTitle('Ajout de produit');
      setType('alert');
      setIsRefresh(false);
      //alert('Duplicate inventory ID');
    } else if (inventoryIds.length >= quantity) {
      setIsOpened(true);
      setMessage('Nombre maximum d\'ID d\'inventaire ajouté');
      setTitle('Ajout de produit');
      setType('alert');
      setIsRefresh(false);
      //alert('You have already added the maximum number of inventory IDs.');
    }
  };

  const getEntries = async () => {
    const response = await fetch('http://localhost:8080/api/entry', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      cache: 'no-cache',
    });
    if (response.ok) {
      const data = await response.json();
      setInventories(data);
      console.log('Inventories:', data);
    }
  };

  useEffect(() => {
    getEntries();
  }, [session]);


  // Handle removing inventory ID
  const handleRemoveInventoryId = (index) => {
    const updatedIds = inventoryIds.filter((_, i) => i !== index);
    setInventoryIds(updatedIds);
  };

  useEffect(() => {
    // Disable/Enable submit button based on whether the number of inventory IDs matches the quantity
    setSubmitDisabled(inventoryIds.length !== quantity);
  }, [inventoryIds, quantity]);

  return (
    <div className={`text-black fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-4 rounded shadow-lg w-1/2 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ajouter un produit</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">X</button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Choisir une option:</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">--Sélectionnez une option--</option>
            <option value="single">Ajouter un seul produit</option>
            <option value="multiple">Ajouter plusieurs produits (CSV)</option>
          </select>
        </div>

        {selectedOption === 'single' && (
          <form onSubmit={handleSingleProductSubmit}>
            <div className="flex">
              <div className="w-[47%] pr-6 m-auto border-r-2">
                {/* Form fields for single product submission */}
                <div className="mb-4">
                  <label className="block text-gray-700">Id d'entrée:</label>
                  <select name="entryId" className="border p-2 rounded w-full" required>
                    <option value="">--Choisir une date d'entrée de stock--</option>
                    {inventories.map((inventory) => (
                      <option key={inventory.id} value={inventory.id}>{inventory.insertedAt}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Type d'article:</label>
                  <select name="typeItem" className="border p-2 rounded w-full" required>
                    <option value="">--Choisir un type--</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.itemType}>{type.itemType}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700">Etat:</label>
                  <select name="etat" className="border p-2 rounded w-full" required>
                    <option value="neuf">Neuf</option>
                    <option value="occasion">Occasion</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Référence:</label>
                  <input name="itemRef" type="text" className="border p-2 rounded w-full" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Marque:</label>
                  <input name="marque" type="text" className="border p-2 rounded w-full" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Detailles:</label>
                  <input name="description" type="text" className="border p-2 rounded w-full" required />
                </div>
                
              </div>

              <div className="w-[45%] m-auto">
              <div className="mb-4">
                  <label className="block text-gray-700">Quantite:</label>
                  <input
                    name="quantity"
                    type="number"
                    className="border p-2 rounded w-full"
                    required
                    onChange={handleQuantityChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Quantite Minimum:</label>
                  <input name="minQuantity" type="number" className="border p-2 rounded w-full" required />
                </div>
               

                <div className="mb-4">
                  <label className="block text-gray-700">Id Inventaire:</label>
                  <input
                    type="text"
                    value={inventoryId}
                    onChange={(e) => setInventoryId(e.target.value)}
                    disabled={inventoryIdInputDisabled}
                    className="border p-2 rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={handleAddInventoryId}
                    className="bg-blue-500 text-white p-2 rounded mt-2"
                    disabled={inventoryIdInputDisabled}
                  >
                    Ajouter Id
                  </button>
                </div>

                <div className="mb-4 h-36 overflow-y-scroll border p-2 rounded">
                  <label className="block text-gray-700">Liste des Ids Inventaires:</label>
                  <ul>
                    {inventoryIds.map((id, index) => (
                      <li key={index} className="flex justify-between items-center border-b py-2">
                        <span>{id}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInventoryId(index)}
                          className="text-red-500"
                        >
                          Supprimer
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={submitDisabled}
                  className="bg-green-500 text-white p-2 rounded mt-4"
                >
                  Ajouter Produit
                </button>
              </div>
            </div>
          </form>
        )}

        {selectedOption === 'multiple' && (
          <form onSubmit={handleCsvImport}>
            <div className="mb-4">
              <label className="block text-gray-700">Importer un fichier CSV:</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
                className="border p-2 rounded w-full"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Importer CSV
            </button>
          </form>
        )}
      </div>
      <Alert
        isOpen={isOpened}
        onClose={() => setIsOpened(false)}
        title={title}
        message={message}
        type={type}
        refresh={isRefresh}
      />
    </div>
  );
};

export default ProductModal;
