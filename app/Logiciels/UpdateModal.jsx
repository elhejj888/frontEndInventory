import { set } from "lodash";
import React, { useState } from "react";
import Alert from "../component/Alert";

const Dialog = ({ isOpen, onClose , Logiciel , handleEdit}) => {

    Logiciel = JSON.parse(Logiciel);

  const [formData, setFormData] = useState({
    img: Logiciel.img,
    title: Logiciel.title,
    description: Logiciel.description,
    detail: Logiciel.detail,
    license: Logiciel.license, 
  });

  const [isOpened, setIsOpened] = useState(false);
    const [message, setMessage] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEdit(Logiciel.id , formData);
    setIsOpened(true);
    setMessage("Logiciel modifié avec succès");
    setFormData({
      img: "",
      title: "",
      description: "",
      detail: "",
      license: "", 
    });
  };


 

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 text-black flex items-center justify-center bg-gray-800 bg-opacity-50 w-full">
      <div className="bg-white p-8 text-black rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Modifier {Logiciel.title}</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-black mb-2">
            Image URL:
            <input
              type="text"
              name="img"
              value={formData.img}
              onChange={handleChange}
              className="block w-full  mt-1 p-2 border border-gray-300 rounded"
            />
          </label>
          <label className="block text-black mb-2">
            Titre:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </label>
          <label className="block text-black mb-2">
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </label>
          <label className="block text-black mb-2">
            Detailles:
            <input
              type="text"
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              className="block w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </label>
          <label className="block text-black mb-2">
            Date d'expiration License:
            <input
              type="date"
              id="license"
              name="license" 
              value={formData.license}
              onChange={handleLicenseChange}
              className="block w-full mt-1 p-2 border border-gray-300 rounded"
            />
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
        title="Modification de Logiciel"
        message={message}
        isOpen={isOpened}
        onClose={() => setIsOpened(false)}
        type="success"
        />
    </div>
  );
};

export default Dialog;
