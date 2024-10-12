import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "../component/Alert";
import { set } from "lodash";

const Dialog = ({data, isOpen, onClose,session }) => {
  const [formData, setFormData] = useState({
    softwareId: "",
  });
  const [softwares, setSoftwares] = useState([]);
  const [softwareId, setSoftwareId] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");


  const router = useRouter();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLicenseChange = (e) => {
    const { value } = e.target;
    // Ensure that the value conforms to the YYYY-MM-DD format.
    if (/\d{4}-\d{2}-\d{2}/.test(value) || value === "") {
      setFormData((prev) => ({ ...prev, license: value }));
    }
  };

  const handleSubmitCommand = async (e) => {
    e.preventDefault();
    
    // Gather the form data directly into an object instead of updating the state
    const commandData = {
      softwareId: formData.softwareId, // Ensure this is up-to-date from the form
      userId: session.user.id,         // Directly from session
      userService: session.user.service // Directly from session
    };
  
    try {
      const response = await fetch("http://localhost:8080/api/softwareCommand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(commandData), // Use the new object here
      });
  
      if (response.ok) {
        const data = await response.json();
        setIsOpened(true);
        setMessage("Commande ajoutée avec succès..!");
        setTitle("Ajout de Commande");
        setType("success");
        
        setSoftwares((prev) => [...prev, data]);
        //onClose();
      }
      else {
        const text = await response.text();
        setIsOpened(true);
        setMessage(text);
        setTitle("Ajout de Commande");
        setType("alert");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 text-black flex items-center justify-center bg-gray-800 bg-opacity-50 w-full">
      <div className="bg-white p-8 text-black rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Commander une Application</h2>
        <form onSubmit={handleSubmitCommand}>
          <label className="block text-black mb-2">
            Logiciels
            <select
              name="softwareId"
              value={formData.softwareId}
              onChange={handleChange}
              className="block w-full  mt-1 p-2 border border-gray-300 rounded"
            >
                <option value="" disabled>Select a software</option>
                {data.map((software) => (
                    <option 
                    onChange={(e) => setSoftwareId(e.target.value)}
                    key={software.id} value={software.id}>
                        {software.title}
                    </option>
                ))}
            </select>
          </label>


          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
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
        </form>
      </div>
      <Alert
        title={title}
        message={message}
        isOpen={isOpened}
        onClose={() => setIsOpened(false)}
        type={type}
      />
    </div>
  );
};

export default Dialog;
