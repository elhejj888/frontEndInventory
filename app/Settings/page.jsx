'use client';
import React, { useState } from 'react';
import Alert from '../component/Alert';
import { useSession } from "next-auth/react";

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
  });
  const [types, setTypes] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [stockEntry, setStockEntry] = useState({
    fournisseur: '',
    nFacture: '',
    entryDate: ''
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: false,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEntryChange = (e) => {
    const { name, value } = e.target;
    setStockEntry({
      ...stockEntry,
      [name]: value
    });
  };

  const handleOnChange = (e) => {
    setTypes(e.target.value);  // Directly use e.target.value
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  const handleSubmitTypes = async (e) => {
    e.preventDefault();
    try{
    const response = await fetch('http://localhost:8080/api/types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ itemType: types }),
    });

    if (response.ok) {
      setIsOpened(true);
      setMessage('Type ajouté avec succès..!');
      setTitle('Ajout de Type!');
      setType('success');
      console.log('Type ajouté');
    } else {
      throw new Error('Failed to add type');
    }
  } catch (error) {
    setIsOpened(true);
    setMessage('Erreur lors de l\'ajout du type..!');
    setTitle('Ajout de Type!');
    setType('error');
    console.error('Error adding type:', error);
  }
  }

  const handleSubmitEntry = async (e) => {
    e.preventDefault();
    try{
    const response = await fetch('http://localhost:8080/api/entry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(stockEntry),
    });

    if (response.ok) {
      setIsOpened(true);
      setMessage('Entree ajoutée avec succès..!');
      setTitle('Ajout d\'Entree!');
      setType('success');
      console.log('Entree ajoutée');
    } else {
      throw new Error('Failed to add entry');
    }
  } catch (error) {
    setIsOpened(true);
    setMessage('Erreur lors de l\'ajout de l\'entree..!');
    setTitle('Ajout d\'Entree!');
    setType('error');
    console.error('Error adding entry:', error);
  }
  }


  if (status === "loading" ) {
    return <p>Chargement...</p>; // Show loading state while fetching data
  }

  if (!session) {
    return <p>Non connecté</p>; // Inform the user they are not logged in
  }
  console.log( session);




  return (
    <div className="min-h-screen bg-white p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Profile Settings */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={profile.name}
              onChange={handleProfileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="emailAlerts"
                checked={notifications.emailAlerts}
                onChange={handleNotificationChange}
                className="mr-2"
              />
              <span>Email Alerts</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="pushNotifications"
                checked={notifications.pushNotifications}
                onChange={handleNotificationChange}
                className="mr-2"
              />
              <span>Push Notifications</span>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Ajouter Parametres</h2>
        <div className="space-y-4">
          <form onSubmit={handleSubmitTypes}>
          <div>
            <div className="flex items-center">
            <span>Type de Produit : </span>
            <input
                type="text"
                name="type"
                value={types}
                checked={notifications.emailAlerts}
                onChange={handleOnChange}
                className="m-2 border-2 border-gray-300 rounded "
              />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Ajouter
            </button>
              </div>
          </div>
          <div>
            
          </div>
        </form>
        </div>
      </div>
      
      {/* Ajouter Entree de Stock */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Ajouter Entree de Stock</h2>
        <div className="space-y-4">
          <form onSubmit={handleSubmitEntry} className='bg-gray-50 p-4 rounded-md shadow-lg'>
          <div>
            <div className="flex items-center space-x-2">
            <span>Fournisseur : </span>
            <input
                type="text"
                name="fournisseur"
                value={stockEntry.fournisseur}
                checked={notifications.emailAlerts}
                onChange={handleEntryChange}
                className="m-2 border-2 border-gray-300 rounded "
              />
              </div>
              <div className="flex items-center space-x-2">
            <span>N˚ du Facture : </span>
            <input
                type="text"
                name="nFacture"
                value={stockEntry.nFacture}
                checked={notifications.emailAlerts}
                onChange={handleEntryChange}
                className="m-2 border-2 border-gray-300 rounded "
              />
              </div>
              <div className="flex items-center space-x-2">
            <span>Date d'entrée : </span>
            <input
                type="date"
                name="entryDate"
                value={stockEntry.entryDate}
                checked={notifications.emailAlerts}
                onChange={handleEntryChange}
                className="m-2 border-2 border-gray-300 rounded "
              />
              </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Ajouter
            </button>

          </div>
          <div>
            
          </div>
        </form>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Account</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Delete Account
        </button>
      </div>
      <Alert
        title={title}
        type={type}
        message={message}
        isOpen={isOpened}
        onClose={() => setIsOpened(false)}
      />
    </div>
  );
};

export default SettingsPage;
