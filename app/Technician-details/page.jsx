'use client';
import { useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react';
import DataTable from './dataTable';

const TechnicianDetails = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const technicianId = searchParams.get('technicianId'); // Retrieve the technicianId from the URL
  const [technicianDetails, setTechnicianDetails] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchTechnicianData = async () => {
      if (!technicianId || !session) return; // Exit if technicianId or session is not ready

      setLoading(true); // Start loading

      try {
        // Fetch technician details
        const responseDetails = await fetch(`http://localhost:8080/auth/user-${technicianId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (!responseDetails.ok) {
          throw new Error(`Error fetching technician details: ${responseDetails.statusText}`);
        }
        const detailsData = await responseDetails.json();
        setTechnicianDetails(detailsData);

        // Fetch breakdown data
        const responseData = await fetch(`http://localhost:8080/api/breakdown/user-${technicianId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (!responseData.ok) {
          throw new Error(`Error fetching breakdown data: ${responseData.statusText}`);
        }
        const breakdownData = await responseData.json();
        setData(breakdownData);
      } catch (err) {
        console.error('Failed to fetch technician data:', err.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchTechnicianData();
  }, [technicianId, session]);

  if (loading) {
    return <p>Loading technician details...</p>; // Display loading state
  }

  return (
    <div className="justify-center items-center h-screen text-black">
      {technicianDetails ? (
        <div className='bg-white p-4 m-2 border-b-2 border-gray-400 border-dashed'>
          <h1 className="text-3xl text-black border-b-2 w-fit px-2 shadow-md m-auto mb-4">
            Liste des pannes de {technicianDetails.firstName} {technicianDetails.lastName}
          </h1>

          <div className="w-full max-w-lg bg-white rounded-lg m-auto mt-4 shadow-md flex p-6 border-2 border-gray-50">
            {/* Left Section: Image */}
            <div className="flex-shrink-0 border-2 border-gray-50">
              <img
                src="/header/avatar.png" // Replace with actual technician's image if available
                alt="Technician"
                className="w-32 h-32 border-2 border-blue-500 shadow-xl rounded-md"
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
        <p>No technician details available.</p>
      )}
      <div className='mx-2 p-2 bg-white rounded-md'>
        <DataTable data={data} session={session} />
      </div>
    </div>
  );
};

export default TechnicianDetails;