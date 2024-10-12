import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const DocumentCard = ({ doc, onDelete, onClick }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="bg-white p-4 rounded shadow-md  border-x-2  bordet-t-white cursor-pointer" onClick={() => onClick(doc)}>
      {doc.fileType === 'image' ? (
        <img
          src={doc.fileUrl}
          alt={doc.title}
          className="w-full h-32 object-cover rounded mb-4"
        />
      ) : (
        <div className="pdf-viewer w-full h-32 rounded mb-4">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.7.570/build/pdf.worker.min.js`}>
            <Viewer fileUrl={doc.fileUrl} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        </div>
      )}
      <h2 className="text-xl font-semibold">{doc.title}</h2>
      <p className="text-gray-600">Assigned to: {doc.assignedClients.join(', ')}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(doc.id);
        }}
        className="mt-4 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-300"
      >
        Delete Document
      </button>
    </div>
  );
};

export default DocumentCard;
