'use client';
import { useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react';
import DataTable from './dataTable';

const TechnicianDetails = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [technicianDetails, setTechnicianDetails] = useState(null);
  const technicianId = searchParams.get('technicianId'); // Retrieve the technicianId from the URL
  const [data, setData] = useState([]);

  useEffect(() => {
    const getTechnicianDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/auth/user-${technicianId}`, {
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
        setTechnicianDetails(data);
      } catch (err) {
        console.error('Failed to get technician details:', err.message);
      }
    };

    const getDatas = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/breakdown/user-${technicianId}`, {
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
            setData(data);
        } catch (err) {
            console.error('Failed to get breakdowns:', err.message);
        }
    };


    if (technicianId && session) {
        getDatas();
      getTechnicianDetails();
    }
  }, [technicianId, session]);

  return (
    <div className=" justify-center items-center h-screen text-black ">

      {technicianDetails ? (
        <div className='bg-white p-4 m-2 border-b-2 border-gray-400 border-dashed'>
              <h1 className="text-3xl text-black border-b-2 w-fit px-2 shadow-md m-auto mb-4">Liste des pannes de {technicianDetails.firstName} {technicianDetails.lastName}</h1>

        <div className="w-full max-w-lg bg-white rounded-lg m-auto mt-4 shadow-md flex p-6  border-2 border-gray-50">
         
          {/* Left Section: Image */}
          <div className="flex-shrink-0  border-2 border-gray-50">
            <img
              src="/header/avatar.png" // Replace with actual technician's image if available
              alt="Technician"
              className="w-32 h-32 border-2 border-blue-500 shadow-xl rounded-md "
            />
          </div>
          {/* Right Section: Details */}
          <div className="ml-6 font-cairo">
            <h2 className="text-3xl font-bold mb-2 text-blue-800">
              {technicianDetails.firstName} {technicianDetails.lastName}
            </h2>
            <p><strong>Username:</strong> {technicianDetails.username}</p>
            <p><strong>Email:</strong> {technicianDetails.email}</p>
            <p><strong>Role:</strong> {technicianDetails.roles}</p>
            <p><strong>Service:</strong> {technicianDetails.service}</p>
          </div>
        </div>
        </div>
      ) : (
        <p>Loading technician details...</p>
      )}
      {technicianDetails ? (
      <div className='mx-2 p-2 bg-white rounded-md'>
      
      <DataTable data={data} session={session} />
    
      </div>
      ) : (
        <p>Loading technician details...</p>
      )}
      
    </div>
  );
};

export default TechnicianDetails;
