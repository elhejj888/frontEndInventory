import React, { useState } from "react";
import SoftwarePanneDialog from './SoftwarePanneDialog';
import UpdateModal from '../Logiciels/UpdateModal';
import Alert from "./Alert";
import { set } from "lodash";


export default function Card({ infos, handleDelete, handleEdit, handlePanne , role }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpenDialog = () => {
    console.log("Panne button clicked"); // Add this to check if the click event works
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const hadnleCLoseUpdate = () => {
    setIsUpdateOpen(false);
  };

  console.log("tt"+role);
  

  return (
    <div className="bg-white shadow-lg rounded-sm flex flex-col m-3">
      <img
        src={infos.img}
        alt="placeholder"
        className="shadow-lg w-1/4 border-2 border-gray-500 p-2 m-auto rounded-xl"
      />
      <div className="flex flex-col w-full p-2 text-center">
        <h1 className="text-xl border-y-2 font-bold">{infos.title}</h1>
        <p className="text-sm mt-2 border-gray-200 text-gray-500">
          {infos.description}
        </p>
        <div className="flex flex-row text-center m-auto ">
          <p className="text-sm text-gray-800">Version : {infos.detail}</p>
          <p className="text-sm text-gray-800 ml-2">Date : {infos.license}</p>
        </div>
        <div className="space-x-4 my-4">
          <button
            onClick={handleOpenDialog}
            className="bg-purple-700 rounded-md w-fit p-2 text-white "
          >
            <img src="/buttons/panne1.png" alt="" className="w-8 h-8" />
          </button>
          {role === "Responsable Software" &&
          <>
          <button 
          onClick={() => {
            setIsUpdateOpen(true);

          }}
          className="bg-blue-600 rounded-md w-fit p-2 text-white 
          ">
            <img src="/buttons/update.png" alt="" className="h-8 w-8"/>
          </button>
          
          <button
            onClick={()=>{handleDelete();
              setIsOpened(true);
              setMessage("Logiciel supprimé avec succès");
            }}
            className="bg-red-700 rounded-md w-fit p-2 text-white "
          >
            <img src="/buttons/delete.png" alt="" className="w-8 h-8" />
          </button>
          </>
}
        </div>
      </div>
      <SoftwarePanneDialog
        isOpen={isDialogOpen}
        product={JSON.stringify(infos)}
        onClose={handleCloseDialog}
        handleCloseDialog={handleCloseDialog}
      />
      <UpdateModal
        isOpen={isUpdateOpen}
        Logiciel={JSON.stringify(infos)}
        handleEdit={handleEdit}
        onClose={hadnleCLoseUpdate}
        handleCloseDialog={hadnleCLoseUpdate}
      />
      <Alert isOpen={isOpened} onClose={() => setIsOpened(false)} message={message} type="success" title="Suppression logiciel" />
    </div>
  );
}
