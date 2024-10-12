'use client';
import React, { useState, useEffect } from 'react';
import DataTable from './dataTable';
import DocumentFormModal from './materialModal';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const App = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State to manage the fetched item data and loading state
  const [itemData, setItemData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  // Fetch materials data once the component mounts and session is available
  useEffect(() => {
    if (!session) {
      return; // Skip the data fetch if session isn't ready
    }

    const getMaterials = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/Item', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', // Set 'application/json' as the correct content type
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setItemData(data); // Update the state with the fetched data
      } catch (err) {
        setError(err.message); // Handle any error during fetching
      } finally {
        setLoading(false); // Turn off loading state after the fetch is complete
      }
    };

    getMaterials();
  }, [session]); // Dependency on the session object

  if (status === "loading" || loading) {
    return <p>Chargement...</p>; // Show loading state while fetching data
  }

  if (!session) {
    return <p>Non connecté</p>; // Inform the user they are not logged in
  }

  if (error) {
    return <p>Erreur: {error}</p>; // Display error message if there's an issue
  }

  return (
    <div className="font-cairo border-gray-200 border-2 shadow-inner p-4 bg-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-cairo border-b-2 text-black border-gray-400 shadow-md font-semibold">Liste des Produits Par Reference</h1>
        {/* Button to open the DocumentForm modal */}
        {/* <button
          className="bg-green-600 text-white p-1.5 rounded hover:bg-green-800 transition duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          <svg className="w-8 h-8 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
        </button> */}
      </div>
      <DataTable session={session} data={itemData} /> {/* Render the DataTable with fetched itemData */}
      
      {/* Render the modal and pass the necessary props */}
      <DocumentFormModal session={session} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default App;