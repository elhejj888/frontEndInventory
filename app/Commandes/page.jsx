'use client';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import CommandModal from './DocumentForm';
import DocumentCard from './pdfCard';
import DocumentModal from './docModal';
import SearchBar from '../layout/SearchBar';
import DataTable from './dataTable';
import SoftwareTable from './SoftwareDataTable';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const Documents = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: 'Document 1',
      fileType: 'image',
      fileUrl: 'https://signaturely.com/wp-content/uploads/2022/08/non-compete-agreement-uplead-791x1024.jpg',
      assignedClients: ['Client A'],
    },
    {
      id: 2,
      title: 'Document 2',
      fileType: 'image',
      fileUrl: 'https://images.examples.com/wp-content/uploads/2018/06/Arbitration-Agreement-Document1.png',
      assignedClients: ['Client B'],
    },
  ]);

  const { data: session, status } = useSession();
  const router = useRouter();

  const [commandData, setCommandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDocument, setNewDocument] = useState({ title: '', fileType: '', fileUrl: '', assignedClients: [] });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [softwareData, setSoftwareData] = useState([]);
  
  // New viewMode state to toggle between cards and table
  const [viewMode, setViewMode] = useState(false); // false = card view, true = table view

  const handleSearch = (searchTerm) => {
    const filteredUsers = commandData.filter(command =>
      command.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCommandData(filteredUsers);
  };



  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewDocument((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
  //     const fileUrl = URL.createObjectURL(file);
  //     setNewDocument((prev) => ({ ...prev, fileType, fileUrl }));
  //   }
  // };

  // const handleSelectChange = (selectedOptions) => {
  //   const selectedClients = selectedOptions ? selectedOptions.map(option => option.value) : [];
  //   setNewDocument((prev) => ({ ...prev, assignedClients: selectedClients }));
  // };

  // const handleAddDocument = (e) => {
  //   e.preventDefault();
  //   if (newDocument.title && newDocument.fileUrl && newDocument.assignedClients.length > 0) {
  //     setDocuments((prev) => [...prev, { ...newDocument, id: prev.length + 1 }]);
  //     setNewDocument({ title: '', fileType: '', fileUrl: '', assignedClients: [] });
  //     setIsModalOpen(false);
  //   }
  // };

  const handleDeleteDocument = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitCommand = async(items) => {
    const dataToSend = {
      recepient: session?.user?.id ,
      infos: items,
    };
    try{
      const response = await fetch('http://localhost:8080/api/Command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(dataToSend),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Command successfully added:', data); // For debugging or further processing
    window.location.reload();
  } 
  catch(err){
    console.error('Failed to submit breakdown:', err.message);
  }
  };

  useEffect(() => {
    if (!session) {
      return;
    }

    const getCommands = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/Command', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setCommandData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const getSoftwareCommands = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/softwareCommand', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setSoftwareData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getSoftwareCommands();
    getCommands();
  }, [session]);
  
  if (status === "loading" || loading) {
    return <p>Chargement...</p>;
  }
  if (!session) {
    return <p>Non connecté</p>;
  }
  if (error) {
    return <p>Erreur: {error}</p>;
  }

  return (
    <>
      <div className="container mx-auto p-4 bg-white w-full text-black">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-cairo border-b-2 border-gray-400 shadow-md font-semibold">Liste des bons de commandes</h1>
          {/* Button to open the DocumentForm modal */}
          <button
            className="bg-green-600 text-white p-1.5  rounded hover:bg-green-800 transition duration-300"
            onClick={() => setIsModalOpen(true)}
            session={session}
          >
            <svg class="w-8 h-8 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
</svg>

          </button>
        </div>

        <div className="text-center w-full mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Toggle switch to switch between card view and table view */}
        <div className="flex justify-center mb-6">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={viewMode}
              onChange={() => setViewMode(!viewMode)}
            />
            <div
              className={`w-11 h-6 rounded-full relative transition-all duration-300 ${
                viewMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${
                  viewMode ? 'translate-x-5' : ''
                }`}
              ></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">{viewMode ? 'Commandes Logiciels' : 'Commandes Materiels'}</span>
          </label>
        </div>

        {/* Conditional rendering of cards or table based on viewMode */}
        {viewMode && (
          <div className="m-auto">
            <SoftwareTable data={softwareData} session={session} />
          </div>
        )}

        {!viewMode && (
          <div className='m-auto'>
            <DataTable data={commandData} session={session} />
          </div>
        )}

        {selectedDocument && (
          <div>
            <DocumentModal doc={selectedDocument} isOpen={!!selectedDocument} onClose={() => setSelectedDocument(null)} />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white p-8 rounded shadow-lg z-10 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <CommandModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCommand}
        session={session}
      />
          </div>
        </div>
      )}
    </>
  );
};

export default Documents;
