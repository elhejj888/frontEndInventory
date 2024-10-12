import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { set } from "lodash";

const PanneDialog = ({ isOpen, onClose, productId , inventaire }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notif, setNotif] = useState("");

  
  const [formData, setFormData] = useState({
    description: "",
    panneType: "",
  });

  const handleChange = (e) => {
    console.log(productId);
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = {
      itemId: productId,
      inventaire : inventaire,
      Service: session?.user?.service || "",
      description: formData.description,
      panneType: formData.panneType,
      declaredBy: session?.user?.id || "",
      isFixed: false,
    };
  
    try {
      const response = await fetch("http://localhost:8080/api/breakdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(dataToSend), // Send the constructed JSON object
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Breakdown successfully added:', data); // For debugging or further processing
      setNotif("Panne Declaré avec succes");
      setFormData({
        description: "",
      });
      window.location.reload();
    } catch (err) {
      console.error('Failed to submit breakdown:', err.message);
    } 
  };
  
  if (status === "loading" && loading) {
    return <p>Chargement...</p>;
  }
  if (!session) {
    return <p>Non connecté</p>;
  }
  if (error) {
    return <p>Erreur: {error}</p>;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 text-black flex items-center justify-center bg-gray-800 bg-opacity-50 w-full">
      <div className="bg-white p-8 text-black rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Add New Breakdown</h2>
        <form onSubmit={handleSubmit}>
        <label className="block text-black mb-2">
            Type de Panne:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </label>
          <label className="block text-black mb-2">
            Description:
            <textarea
              name="panneType"
              value={formData.panneType}
              onChange={handleChange}
              className="block w-full mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </label>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                setFormData({
                  description: "",
                });
                setNotif("");
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
          {notif && <p className="text-sm text-green-500 mt-2">{notif}</p>}
        </form>
      </div>
    </div>
  );
};

export default PanneDialog;
