'use client';
import React, { useState, useMemo } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import PanneDialog from '../component/panneDialog';
import Alert from '../component/Alert';
import 'tailwindcss/tailwind.css';
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

  const columns = useMemo(
    () => [
      { Header: 'Reference', accessor: 'reference' },
      { Header: 'Produit', accessor: 'itemType' },
      { Header: 'Marque', accessor: 'marque' },
      { Header: 'Detaille', accessor: 'description' },
      { Header: 'Quantite', accessor: 'quantity' },
      { Header: 'Quantite minimale', accessor: 'minQuantity' },
      { Header: "Date d'ajout", accessor: 'insertedAt' },
      //{ Header: "Date de modification", accessor: 'modifiedAt' },

    ],
    []
  );

  console.log(data);

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

  const handleOpenDialog = (id) => {
    setSelectedProductId(id);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProductId(null);
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
        alert('Products successfully deleted');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting products:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/Inventory/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      if (response.ok) {
        //alert('Produit supprimé avec succès');
        setIsOpened(true);
        setMessage('Produit supprimé avec succès');
        setTitle('Suppression de produit');
        setType('success');
        //window.location.reload();
      }
      else if(!response.ok){
        setIsOpened(true);
        setTitle('Erreur de suppression !');
        setMessage('Erreur lors de la suppression..! des Materiels sont en cours d\'utilisation');
        setType('alert');
        //alert('Erreur lors de la suppression..! des Materiels sont en cours d\'utilisation');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  return (
    <div className='shadow-md'>
      <div className="flex flex-col">
      <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      
      
      </div>
      <table {...getTableProps()} className="min-w-full bg-white">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-blue-600">
             
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
                
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="py-2 px-4 text-base text-gray-700"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
                <td>
                  <div className="space-x-2 my-4 flex">
                    <button className="bg-blue-600 rounded-md w-fit p-2 text-white hover:bg-blue-700">
                      <img src="/buttons/update.png" alt="" className='w-6 h-6' />
                    </button>
                    <button 
                    className="bg-red-700 rounded-md w-fit p-2 text-white hover:bg-red-800"
                    onClick={()=> handleDelete(row.original.id)}>
                      <img src="/buttons/delete.png" alt="" className='w-6 h-6 '/>
                    </button>
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
        onClose={handleCloseDialog}
        handleCloseDialog={handleCloseDialog}
      />
      <Alert 
      isOpen={isOpened}
      message={message}
      title={title}
      onClose={()=>setIsOpened(false)}
      type={type}
      />
    </div>
  );
};

export default DataTable;
