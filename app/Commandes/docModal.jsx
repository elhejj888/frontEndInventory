
const DocumentModal = ({ doc, isOpen, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="relative bg-white p-4 rounded shadow-lg max-w-md w-full">
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 text-xl font-bold bg-gray-200 p-2 rounded-full hover:bg-gray-400 transition duration-300"
          >
            &times;
          </button>
          {doc.fileType === 'image' ? (
            <img src={doc.fileUrl} alt={doc.title} className="w-full h-auto object-cover rounded mb-4" />
          ) : (
            <object data={doc.fileUrl} type="application/pdf" className="w-full h-96 object-cover rounded mb-4" />
          )}
          <h2 className="text-xl font-semibold">{doc.title}</h2>
          <p className="text-gray-600">Assigned to: {doc.assignedClients.join(', ')}</p>
        </div>
      </div>
    );
  };
  
  export default DocumentModal;