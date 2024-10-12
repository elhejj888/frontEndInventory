'use client';
import { button } from '@material-tailwind/react';
import React, { useMemo } from 'react';
import { useTable, useGlobalFilter , useSortBy } from 'react-table';
import 'tailwindcss/tailwind.css';
import VerificationModal from './verificationModal';
import { json } from 'react-router-dom';
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

const DataTable = ({ data,session }) => {

  let test=false;
  const[isOpened,setIsOpened]=React.useState(false);
  const [commandData, setCommandData] = React.useState([]);
  const [commandId, setCommandId] = React.useState(null);
  const [message, setMessage] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const columns = useMemo(
    () => [
      // { Header: 'ID', accessor: 'id' },
      { 
        Header: 'Date', 
        accessor: 'commandDate', 
        Cell: ({ value }) => new Date(value).toLocaleDateString() // Format the date
      },
      { Header: 'Exécutant', accessor: 'recepient' },
      // { Header: 'Validateur', accessor: 'responsableId' },
      { Header: 'Statut', accessor: 'status' },
      {
        Header: 'P:Q',
        accessor: 'infos',
        Cell: ({ value }) => (
          <ul>
            {value.map((item, index) => (
              <li key={index} className='w-fit'>
                <span className='font-bold'>{item.itemType}:</span>{item.quantity}
              </li>
            ))}
          </ul>
        )
      },
      {
        Header: 'Delivered P:Q',
        accessor: 'deliveredItems',
        Cell: ({ value }) => (
          value && value.length > 0 ? (
            <ul>
              {value.map((item, index) => (
                <li key={index} className='w-fit'>
                  <span className='font-bold'>{item.itemType}:</span> {item.quantity}
                </li>
              ))}
            </ul>
          ) : (
            <span>--</span>  // Display `--` if value is null or empty
          )
        )
      },
      
      {
        Header: 'Actions',
        accessor: 'actions', // This is the new column for conditional actions
        Cell: ({ row }) => {
          const status = row.original.status;
          const role = session.user.roles; // Assuming session contains userRole
          const commandId = row.original.id;

          // Check conditions for the button rendering
          if (role === 'Chef de Service' && status === 'Brouillon') {
            test=true;
            return (
              <button
                className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded"
                onClick={() => handleAction(commandId, 'Validee', session.user.firstName + " " + session.user.lastName)}
              >
                Valider
              </button>
            );
          }
          if (role === 'Technicien Materiel' && status === 'Validee') {
            test=true;
            return (
              <button
                className="bg-purple-600 hover:bg-purple-800 text-white text-sm font-bold py-2 px-4 rounded"
                onClick={() => {setIsOpened(true); setCommandData(row.original.infos); setCommandId(row.original.id)}}
              >
                Verifier
              </button>
            );
          }

          if (role === 'Responsable Hardware' && status === 'Verifiee') {
            test=true;
            return (
              <button
                className="bg-orange-600 hover:bg-orange-800 text-white text-sm font-bold py-2 px-4 rounded"
                onClick={() => handleAction(commandId, 'Confirmee' , session.user.firstName + " " + session.user.lastName)}
              >
                Confirmer
              </button>
            );
          }

          if (role === 'Responsable de Stock' && status === 'Confirmee') {
            test=true;
            return (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded"
                onClick={() => handleAction(commandId, 'Livree' , session.user.firstName + " " + session.user.lastName)}
              >
                Livrer
              </button>
            );
          }

          // Return nothing if conditions are not met
          return null;
        },
        Header: () => test ? 'Action' : null,

      },
      {
        Header: 'Bon de Commande',
        accessor: 'commande',  // Unique accessor value
        Cell: ({ row }) => (
          row.original.confirmed ? <button
            onClick={async () => {
              const response = await fetch(`http://localhost:8080/api/pdfGeneration/${row.original.id}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${session.accessToken}`, // Add Authorization header
                },
              });
      
              if (response.ok) {
                const blob = await response.blob(); // Get the PDF file as a blob;
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank'); // Open the PDF in a new tab
                
                // Optionally, you can trigger a download automatically
                // const link = document.createElement('a');
                // link.href = url;
                // link.setAttribute('download', ${row.original.id}.pdf); // Set filename for the download
                // document.body.appendChild(link);
                // link.click(); // Trigger the download
                // link.parentNode.removeChild(link); // Clean up
              } else {
                console.error('Failed to download PDF');
              }
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-2 rounded"
          >
            <img src="/buttons/pdf.png" className='w-10 h-10'/>
            
          </button>
          : null
        ),
        Header: ({ data }) => data.some(row => row.confirmed) ? 'Bon de commande' : null,
      },
      
      {
        Header: 'Bon de Livraison',
        accessor: 'download',  // Unique accessor value
        Cell: ({ row }) => (
          row.original.delivered ? <button
            onClick={async () => {
              const response = await fetch(`http://localhost:8080/api/delivery/${row.original.id}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${session.accessToken}`, // Add Authorization header
                }
              });
      
              if (response.ok) {
                const blob = await response.blob(); // Get the PDF file as a blob
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank'); // Open the PDF in a new tab
              } else {
                console.error('Failed to download PDF');
              }
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white text-center text-sm  font-bold py-2 px-2 rounded"
          >
            <img src="/buttons/pdf.png" className='m-auto align-middle self-center w-10 h-10'/>
          </button>
          : null
        ),
        Header: ({ data }) => data.some(row => row.confirmed) ? 'Bon de Livraison' : null,
      }
    ],
    [session] // Add session to dependencies, so it updates if user role changes
  );  
  console.log(session.user.roles);
  // Function to handle action based on button click
  const handleAction = async (commandId, actionType, userInfos) => {
    try {
      const response = await fetch(`http://localhost:8080/api/Command/cmd-${commandId}/${actionType}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: userInfos// Send the actionType as the request body,
      });
      if (response.ok) {
        const responseText = await response.text();  // Get the response text
        setIsDialogOpen(true);
        setMessage(responseText);
        //setMessage(`Commande ${actionType} avec succès`);
        setTitle(`Commande ${actionType}!`);

        responseText === "Updated Successfully ..!" ? setType('success') :setType('alert');
        
      } else {
        setIsDialogOpen(true);
        setMessage('Erreur lors de la validation de la commande');
        setTitle('Erreur de validation!');
        setType('alert');
        console.error('Action failed');
      }
    } catch (error) {
      setIsDialogOpen(true);
        setMessage('Erreur lors de la validation de la commande');
        setTitle('Erreur de validation!');
        setType('alert');
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
    useGlobalFilter, // useGlobalFilter hook for searching
    useSortBy         // Enable sorting

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
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="py-2 px-4 text-left text-base font-medium text-white"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽' // Sorting descending
                        : ' 🔼' // Sorting ascending
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
      <VerificationModal isOpen={isOpened} onClose={()=>setIsOpened(false)}
       sess={JSON.stringify(session)} commandId={commandId} initialItems={commandData}/>
       <Alert
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={title}
        message={message}
        type={type}
      />
    </div>
  );
};

export default DataTable;