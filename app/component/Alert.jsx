import React from "react";

const Alert = ({ title, message, isOpen, onClose, type="alert" , refresh=true }) => {
    if (!isOpen) return null;
  
    // Determine styles based on the type
    const borderColor = type === "alert" ? "border-red-600" : "border-green-600";
    const textColor = type === "alert" ? "text-red-700" : "text-green-700";
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className={`bg-white p-6 rounded-lg shadow-lg border-4 ${borderColor} w-full max-w-sm`}>
          <div className="flex">
            {type === "alert" ? (
             <img src="/buttons/danger.png" alt="" className="h-8 w-8 mt-2" />
            ) : (
              <img src="/buttons/success.png" alt="" className="h-8 w-8 mt-2" />
            )}
          <h2 className={`text-xl ${textColor} border-b-2 p-2 shadow-sm font-bold mb-4`}>{title}</h2>
          </div>
          <p className="mb-4 text-center text-black text-lg">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={() => {
                onClose();
                if(refresh){
                window.location.reload();
                }
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Alert;
  
