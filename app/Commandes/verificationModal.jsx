import React, { useState } from 'react';

const ItemsList = ({ initialItems, commandId , isOpen , onClose , sess }) => {
    const session = JSON.parse(sess);
    if (!isOpen) return null;

  const [items, setItems] = useState(initialItems);

  const handleQuantityChange = (index, event) => {
    const newItems = [...items];
    newItems[index].quantity = event.target.value;
    setItems(newItems);
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    console.log(items);
    console.log(sess);
    try {
      const response = await fetch(`http://localhost:8080/api/Command/verify-${commandId}/user-${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items)
      });
      if (response.ok) {
        alert('Command successfully verified!');
        window.location.reload();
      } else {
        console.error('Verification failed');
      } 
    }
    catch (error) {
      console.error('Error during verification:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="relative bg-white p-4 rounded shadow-lg max-w-md w-full">
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 text-xl font-bold bg-gray-200 p-2 rounded-full hover:bg-gray-400 transition duration-300"
          >
            &times;
          </button>
    <div className="flex flex-col w-full p-4">
          <h1 className="text-3xl font-bold font-cairo w-full text-center border-b-2 shadow-md py-2 text-blue-900 ">Verification du Commande</h1>
          </div>
    <form onSubmit={handleVerification}>
      {items.map((item, index) => (
        <div key={item.id} className="mb-4 flex items-center space-x-4 text-base p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <label className=" w-1/2 text-lg font-semibold">{item.itemType} :</label>
        <input
          type="number"
          value={item.quantity}
          onChange={(event) => handleQuantityChange(index, event)}
          className="w-1/2  text-center border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
        />
      </div>
      
      ))}
        <button type="submit" className="bg-blue-500 w-full text-white p-2 rounded hover:bg-blue-700 transition duration-300">Verify</button>
    </form>

    </div>
    </div>
  );
};
export default ItemsList;
