'use client';
import { button } from '@material-tailwind/react';
import React, { useMemo , useState } from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import Alert from '../component/Alert';
import 'tailwindcss/tailwind.css';

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

const DataTable = ({ data,session }) => {

  let test=false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'ID Logiciel', accessor: 'softwareId' },
      { Header: 'Demandeur', accessor: 'userId' },
      { Header: 'Validateur', accessor: 'validateur' },
      { Header: 'Service', accessor: 'userService' },

      // { Header: 'Validateur', accessor: 'responsableId' },
      
      { 
        Header: 'Date', 
        accessor: 'commandDate', 
        Cell: ({ value }) => new Date(value).toLocaleDateString() // Format the date
      },
      {
        Header: 'Actions',
        accessor: 'actions', // This is the new column for conditional actions
        Cell: ({ row }) => {
          const confirmed = row.original.confirmed;
          const role = session.user.roles; // Assuming session contains userRole
          const commandId = row.original.id;

          // Check conditions for the button rendering
          if (role === 'Responsable Software' && !confirmed) {
            test=true;
            return (
              <button
                className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded"
                onClick={() => {handleAction(commandId);
                  setMessage('Commande validée');
                  setIsModalOpen(true);
                }}
              >
                Valider
              </button>
            );
          }

          // Return nothing if conditions are not met
          return null;
        },
        Header: () => test ? 'Action' : null,

      }      
    ],
    [session] // Add session to dependencies, so it updates if user role changes
  );  
  console.log(session.user.roles);
  // Function to handle action based on button click
  const handleAction = async (commandId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/softwareCommand/cmd-${commandId}/user-${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        alert(`Command ${actionType} successfully!`);
        window.location.reload(); // Reload page or refresh table data
      } else {
        console.error('Action failed');
      }
    } catch (error) {
      console.error('Error during action:', error);
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter // useGlobalFilter hook for searching
  );

  return (
    <div className='shadow-md text-xl m-0'>
      {/* <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} /> */}
      <table {...getTableProps()} className="min-w-full bg-white">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-blue-600">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="py-2 px-4 text-left text-base font-medium text-white"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="border-t">
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="py-2 px-4 text-sm text-gray-700"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Alert 
      isOpen={isModalOpen}
       onClose={()=>setIsModalOpen(false)} message={message} title="Validatio du Commande" type="success" />
    </div>
  );
};

export default DataTable;