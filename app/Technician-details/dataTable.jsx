'use client';
import React, { useState, useMemo } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import Alert from '../component/Alert';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';
import { set } from 'lodash';
import AssignTechnician from '../Pannes/AssignModal';
import ReportModal from '../Pannes/ReportModal';

// GlobalFilter component for searching
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <input
      value={globalFilter || ''}
      onChange={(e) => setGlobalFilter(e.target.value)}
      placeholder="Search..."
      className="p-2 border w-1/2 shadow-md border-gray-300 rounded mb-4"
    />
  );
};

const DataTable = ({ data, session }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [action, setAction] = useState('');
  const [formData, setFormData] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  

  const columns = useMemo(
    () => [
      { Header: 'Produit', accessor: 'inventaire' },
      { Header: 'Service', accessor: 'Service' },
      { Header: 'detailles', accessor: 'description' },
      { Header: 'date de Panne', accessor: 'breakedAt' },
      { Header: 'est réparé', accessor: 'isFixed', Cell: ({ value }) => (value ? 'Yes' : 'No') },
      { Header: 'date de réparation', accessor: 'fixedAt' },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state: { globalFilter },
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,  // useGlobalFilter hook for searching
    useSortBy         // useSortBy hook for sorting
  );

  console.log('userId:', session?.user?.id);
  let userId = session?.user?.id;

  

  const handleRepair = (id) => {
    setAction('Réparer');
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleDecline = (id) => {
    setAction('Refuser');
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const submitReport = async (formData) => {
    try {
      const endpoint = action === 'Réparer'
        ? `http://localhost:8080/api/breakdown/fix-${selectedId}`
        : `http://localhost:8080/api/breakdown/decline-${selectedId}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(formData), // Send formData correctly
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      setIsOpened(true);
      setMessage(action === 'Réparer' ? 'Panne réparée avec succès..!' : 'Panne refusée..!');
      setTitle(action === 'Réparer' ? 'Réparation de la Panne!' : 'Refus de la Panne!');
      setType(action === 'Réparer' ? 'success' : 'alert');
      setIsModalOpen(false);
      setFormData({ report: '', remarque: '' }); // Reset form data after submission
    } catch (err) {
      setIsOpened(true);
      setMessage(action === 'Réparer' ? 'Erreur lors de la réparation de la panne' : 'Erreur lors du refus de la panne');
      setTitle(action === 'Réparer' ? 'Réparation de la Panne!' : 'Refus de la Panne!');
      setType('alert');
      console.error(`Failed to ${action.toLowerCase()} breakdown:`, err.message);
    }
  };

  const handleReport = async (id) => {
  try {const response = await fetch(`http://localhost:8080/api/report/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.accessToken}`,
    },
  });
  if (response.ok) {
    const blob = await response.blob(); // Get the PDF file as a blob;
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank'); // Open the PDF in a new tab

  } else {
    setIsOpened(true);
    setMessage('Erreur lors de la génération du rapport');
    setTitle('Erreur de génération de rapport');
    setType('alert');

    //console.error('Failed to download PDF');
  }
}
  catch (err) {
    setIsOpened(true);
    setMessage('Erreur lors de la génération du rapport');
    setTitle('Erreur de génération de rapport');
    setType('alert');

    console.error('Failed to generate report:', err.message);
  }
  

  };


  return (
    <div className='shadow-md text-xl'>
      <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
     
      <table {...getTableProps()} className="min-w-full bg-white">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-blue-600">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())} // Enable sorting
                  className="py-2 px-4 text-left text-base font-medium text-white"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽' // Indicates sorting in descending order
                        : ' 🔼' // Indicates sorting in ascending order
                      : ''}
                  </span>
                </th>
              ))}
              
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const technicianId = row.original.technicianId;
            const isFixed = row.original.isFixed;
            const isDeclined = row.original.isDeclined;
            

            return (
              <tr {...row.getRowProps()} className="border-t">
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="py-2 px-4 text-base text-gray-700"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
                <td>
                  <div className="space-x-4 text-base my-4">
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      
      
      <Alert
        isOpen={isOpened}
        message={message}
        title={title}
        onClose={() => setIsOpened(false)}
        type={type}
      />
    </div>
  );
};

export default DataTable;
