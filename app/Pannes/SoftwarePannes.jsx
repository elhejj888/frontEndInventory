'use client';
import React, { useState, useMemo } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import AssignTechnician from './AssignSoft';
import 'tailwindcss/tailwind.css';
import ReportModal from './ReportModal'; // Import the modal component
import { set } from 'lodash';
import Alert from '../component/Alert';

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
  const [notifs, setNotifs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [action, setAction] = useState('');
  const [formData, setFormData] = useState('');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const columns = useMemo(
    () => [
      { Header: 'Panne', accessor: 'id' },
      { Header: 'Software', accessor: 'software' },
      { Header: 'Service', accessor: 'service' },
      { Header: 'Technicien', accessor: 'technicianId' },
      { Header: 'detailles', accessor: 'description' },
      { Header: 'date de Panne', accessor: 'declaredAt' },
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

  const handleAssign = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/softwareBreakDown/assign-${id}/tech-${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      if (!response.ok) {
        setIsDialogOpen(true);
        setMessage('Erreur lors de l\'assignation du Panne..!'); // For debugging or further processing
        setTitle('Assignation de Panne!');
        setType('alert');
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setIsDialogOpen(true);
      setMessage('Panne Assigné avec succes..!'); // For debugging or further processing
      setTitle('Assignation de Panne!');
      setType('success');
      setNotifs('Panne Assigné avec succes..!'); // For debugging or further processing
      window.location.reload();  // Force a hard refresh of the entire page
    } catch (err) {
      console.error('Failed to assign breakdown:', err.message);
    }
  };

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
        ? `http://localhost:8080/api/softwareBreakDown/fix-${selectedId}`
        : `http://localhost:8080/api/softwareBreakDown/decline-${selectedId}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(formData), // Send formData correctly
      });
  
      if (!response.ok) {
        setIsDialogOpen(true);
        setMessage(action === 'Réparer' ? 'Erreur lors de la réparation de la panne' : 'Erreur lors du refus de la panne');
        setTitle(action === 'Réparer' ? 'Réparation de la Panne!' : 'Refus de la Panne!');
        setType('alert');

        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      setIsDialogOpen(true);
      setTitle(action === 'Réparer' ? 'Réparation de la Panne!' : 'Refus de la Panne!');
      setType(action === 'Réparer' ? 'success' : 'alert');
      setMessage(action === 'Réparer' ? 'Panne réparée avec succès..!' : 'Panne refusée..!');
      setIsModalOpen(false);
      setFormData({ report: '', remarque: '' }); // Reset form data after submission
    } catch (err) {
      setIsDialogOpen(true);
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
    setIsDialogOpen(true);
    setMessage('Erreur lors de la génération du rapport..!');
    setTitle('Erreur de génération de rapport!');
    setType('alert');
    console.error('Failed to download PDF');
  }
}
  catch (err) {
    setIsDialogOpen(true);
    setMessage('Erreur lors de la génération du rapport..!');
    setTitle('Erreur de génération de rapport!');
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
              <th 
              className="py-2 px-4 text-left text-base font-medium text-white">
                Operations
              </th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const technicianId = row.original.technicianId;
            const isFixed = row.original.fixed;
            const isDeclined = row.original.declined;

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
                    {(session.user.roles === "Responsable Software" || session.user.roles === "Technicien Logiciel") &&!technicianId && !isFixed && (
                      <button
                        className="bg-blue-600 rounded-md w-fit p-2 text-white"
                        
                        onClick={() => {
                          if(session.user.roles === "Technicien Logiciel") {
                          handleAssign(row.original.id)
                          }
                          else {
                              setIsOpened(true);
                              setSelectedId(row.original.id);
                          }
                      
                        }} // Assign the breakdown
                      >
                        <img src="/buttons/assign.png" alt="" className='h-8 w-8' />
                        </button>
                    )}
                    {technicianId === userId && !isFixed && !isDeclined && (
                      <div className='flex space-x-1'>
                        <button 
                        onClick={() => handleRepair(row.original.id)} // Mark Item as repaired
                        className="bg-green-600 rounded-md w-fit p-2 text-white">
                          <img src="/buttons/check.png" alt="" className='w-6 h-6'/>

                        </button>
                        <button
                        onClick={() => handleDecline(row.original.id)} // Decline the breakdown 
                        className="bg-red-700 rounded-md w-fit p-2 text-white">
                          <img src="/buttons/x.png" alt="" className='h-6 w-6' />

                        </button>
                      </div>
                    )}
                    {(isFixed || isDeclined) && (
                      <div className='mx-2'>
                      <button
                       onClick={() => handleReport(row.original.id)} // Generate a report
                       className="bg-blue-500 rounded-md w-full p-2 m-auto text-white">
                        rapport
                      </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={submitReport} // Pass submitReport function
        action={action}
        formData={formData} // Pass formData and setFormData
        setFormData={setFormData}
      />
      <AssignTechnician
      isOpen={isOpened}
      onClose={() => setIsOpened(false)}
      panneId={selectedId}
      sess={JSON.stringify(session)}
    />
    <Alert
      isOpen={isDialogOpen}
      message={message}
      title={title}
      onClose={() => setIsDialogOpen(false)}
      type={type}
    />
    </div>
  );
};

export default DataTable;
