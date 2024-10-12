'use client';
import React, { useState, useMemo } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import PanneDialog from '../component/panneDialog';
import 'tailwindcss/tailwind.css';
import Alert from '../component/Alert';
import { set } from 'lodash';

// GlobalFilter component for searching
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <input
      value={globalFilter || ''}
      onChange={(e) => setGlobalFilter(e.target.value)}
      placeholder="Search..."
      className="w-1/2 shadow-md p-2 border border-gray-300 rounded mb-4"
    />
  );
};

const DataTable = ({ data , session}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isOpened, setIsOpened] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [inventaire, setInventaire] = useState('');


  const columns = useMemo(
    () => [
      { Header: 'Reference', accessor: 'reference' },
      { Header: 'Produit', accessor: 'itemType' },
      { Header: "N˚ d'inventaire", accessor: 'ninventaire' },
      { Header: 'Etat', accessor: 'etat' },
      { Header: 'Assignee à', accessor: 'userId' ,      Cell: ({ value }) => (value ? value : 'non-assigné') },
      { Header: 'Service', accessor: 'service' ,Cell: ({ value }) => (value ? value : 'stock')},
      { Header: "Date d'ajout", accessor: 'createdAt' },
      //{ Header: "Date de modification", accessor: 'modifiedAt' },

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
    useGlobalFilter,  // Enable global filtering
    useSortBy         // Enable sorting
  );

  const handleOpenDialog = (id , ninventaire) => {
    setSelectedProductId(id);
    setInventaire(ninventaire);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProductId(null);
    setInventaire('');
  };
  const handleSelectItem = (id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(id)) {
        // If the item is already selected, remove it
        return prevSelectedItems.filter((itemId) => itemId !== id);
      } else {
        // Otherwise, add it to the selected items
        return [...prevSelectedItems, id];
      }
    });
  };
  
  const handleDeleteMany = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/Item/deleteMany', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(selectedItems),
      });
      if (response.ok) {
        setIsOpened(true);
        setMessage('Produit Supprimé avec succès');
        setTitle('Suppression du Produit!');
        setType('success');
        //alert('Products successfully deleted');
        //window.location.reload();
      }
    } catch (error) {
      setIsOpened(true);
      setMessage('Erreur lors de la suppression du produit');
      setTitle('Erreur de suppression!');
      setType('error');
      //console.error('Error deleting products:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/Item/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      if (response.ok) {
        setIsOpened(true);
        setMessage('Produit Supprimé avec succès');
        setTitle('Suppression du Produit!');
        setType('success');
        //alert('Product successfully deleted');
        //console.log(response);
        //window.location.reload();
      }
    } catch (error) {
      setIsOpened(true);
      setMessage('Erreur lors de la suppression du produit');
      setTitle('Erreur de suppression!');
      setType('error');

      //console.error('Error deleting product:', error);
    }
  }

  return (
    <div className='shadow-md'>
      <div className="flex flex-col">
      <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      
      {selectedItems && <button
        onClick={() => {handleDeleteMany()}}
       className=" w-fit pd-4 font-bold bg-blue-600 text-white p-2 rounded-md my-4">
        delete All
      </button>}
      </div>
      <table {...getTableProps()} className="min-w-full bg-white">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-blue-600">
             <th></th>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())} // Add sorting props
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
            const isChecked = selectedItems.includes(row.original.id); // Check if item is selected
            const className = row.original.quantity <= row.original.minQuantity ? "border-t bg-red-50" : "border-t bg-green-50";
            
            return (
              <tr {...row.getRowProps()} className={className}>
                <td>
          {row.original.userId === 0 && <input
            type="checkbox"
            checked={isChecked}
            onChange={() => handleSelectItem(row.original.id)} // Handle selection
          />}
        </td>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="py-2 px-4 text-base text-gray-700"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
                <td>
                  <div className="space-x-2 my-2 flex">
                    <button
                      className="bg-purple-700 rounded-md w-fit p-2 text-white"
                      onClick={() => handleOpenDialog(row.original.id , row.original.ninventaire)} // Pass the id to the dialog
                    >
                      <img src="/buttons/panne1.png" alt="" className='w-8 h-8' />
                    </button>
                    {row.original.userId === 0 ?  ( 
                    <button className="bg-blue-600 rounded-md w-fit p-2 text-white">
                    <img src="/buttons/update.png" alt="" className='w-8 h-8' />
                    </button>)
                    : ( 
                      <button 
                            className={`bg-gray-600 rounded-md w-fit p-2 text-white 'opacity-50 cursor-not-allowed' : ''`} 
                            disabled={true}  // Disable based on the disabled state
                          >
                            <img src="/buttons/update.png" alt="Update" className='w-8 h-8' />
                          </button>
                          )
                     }
                     {row.original.userId === 0 ?  (          
                    <button 
                    className="bg-red-700 rounded-md w-fit p-2 text-white"
                    onClick={()=> handleDelete(row.original.id)}>
                      <img src="/buttons/delete.png" alt="" className='w-8 h-8' />
                    </button>
                     )
                      : ( 
                        <button 
                              className={`bg-gray-600 rounded-md w-fit p-2 text-white 'opacity-50 cursor-not-allowed' : ''`} 
                              disabled={true}  // Disable based on the disabled state
                            >
                              <img src="/buttons/delete.png" alt="Delete" className='w-8 h-8' />
                            </button>
                            )
                      }
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <PanneDialog
        isOpen={isDialogOpen}
        productId={selectedProductId}
        inventaire = {inventaire}
        onClose={handleCloseDialog}
        handleCloseDialog={handleCloseDialog}
      />
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
