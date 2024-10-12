'use client';
import React, { useState, useEffect } from "react";
import CardContainer from "../component/cardContainer";
import Dialog from "./Dialog";
import CommandModal from "./commandDialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { set } from "lodash";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCommandModalOpen, setIsCommandModalOpen] = useState(false);
  const [dropData, setDropData] = useState([]);

  const handleOpenDialog = () => {
    if(session.user.roles==="Responsable Software")
    setIsDialogOpen(true);
    else
    setIsCommandModalOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDeleteCard = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/Software/del-${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      if (response.ok) {
        setTimeout(() => {
          setCardsData((prevData) => prevData.filter((card) => card.id !== id));
        }, 1500); // Wait 1.5 seconds before updating the state
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleAddCard = async(newCard) => {
    
    try {
      const response = await fetch("http://localhost:8080/api/Software", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(newCard),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      if(session.user.roles==="Responsable Software")
      {
      setCardsData([...cardsData, data]);
      setDropData([...dropData, data]);
      }
      else
      setDropData([...dropData, data]);
    }
    catch (err) {
      setError(err.message);
    }
    finally {
      setLoading(false);
    }
    handleCloseDialog();
  };

  const handleUpdateCard = async (id, updatedCard) => {
    try {
      const response = await fetch(`http://localhost:8080/api/Software/update-${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(updatedCard),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setCardsData(cardsData.map((card) => (card.id === id ? data : card)));
    }
    catch (err) {
      setError(err.message);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session) {
      return;
    }

    const getApplications = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/Software", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if(session.user.roles==="Responsable Software")
        {
        setCardsData(data);
        setDropData(data);
        }
        else
        {
          setDropData(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const getApplicationsByUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/Software/user-${session.user.id}`, {
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
      setCardsData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

    };
    
    getApplications();
    if(session.user.roles!="Responsable Software")
    getApplicationsByUser();
  }
  , [session]);

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
    <div className="bg-white font-cairo">
      <div className="bg-transparent flex border-b-2  z-10">
        <h1 className="text-3xl bg-transparent border-b-2 text-black shadow-md px-3 m-4">Liste des Applications</h1>
        <button
          onClick={handleOpenDialog}
          className="flex mr-4 shadow-lg bg-green-500 hover:bg-green-800 text-white py-2 px-4 m-auto rounded "
        >
          <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
</svg>

           Application
        </button>
      </div>
      <div className="flex text-black flex-row">
        <CardContainer cardsData={cardsData} handleDelete={handleDeleteCard} handleEdit = {handleUpdateCard} role={session.user.roles} />
      </div>
      
      <Dialog isOpen={isDialogOpen} onClose={handleCloseDialog} onSubmit={handleAddCard} service={session.user.service} />
      <CommandModal data={dropData} isOpen={isCommandModalOpen} onClose={() => setIsCommandModalOpen(false)} session={session} />
      </div>
  );
}
