import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="relative mb-4 shadow-md">
      <input
        type="text"
        placeholder="Search by username or full name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className=" text-black w-full p-2 border border-gray-300 rounded"
      />
      <button onClick={handleSearch} className="absolute inset-y-0 right-0 px-4 bg-blue-600 text-white rounded-r hover:bg-blue-500 transition duration-300">Search</button>
    </div>
  );
};

export default SearchBar;