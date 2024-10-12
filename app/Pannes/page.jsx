'use client';
import React, { useState, useEffect } from 'react';
import DataTable from './dataTable';
import SoftwarePannes from './SoftwarePannes';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';


const App = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [breakdownData, setBreakdownData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(false); // false = standard view, true = software view

  const isSoftware = session?.user?.roles.includes("Software");

  useEffect(() => {
    if (!session) {
      return;
    }

    const getBreakdowns = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/breakdown', {
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
        setBreakdownData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const getSoftwareBreakdowns = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/softwareBreakDown', {
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
        setBreakdownData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (viewMode) {
      getSoftwareBreakdowns();
    } else {
      getBreakdowns();
    }
  }, [session, viewMode]);

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
    <div className="p-4 font-cairo bg-white">
      <h1 className="text-3xl text-black border-b-2 w-fit px-2 shadow-md mb-4">Liste des pannes en maintenance</h1>
      
      {/* Toggle switch to switch between DataTable and SoftwarePannes */}
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
          <span className="ml-3 text-sm font-medium text-gray-900">{viewMode ? 'Logiciels' : 'Matériels'}</span>
        </label>
      </div>

      {viewMode ? (
        <SoftwarePannes data={breakdownData} session={session} />
      ) : (
        <DataTable data={breakdownData} session={session} />
      )}
    </div>
  );
};

export default App;
