
'use client';

import React from 'react';

const Card = ({ title, stats }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-left">
      <h2 className="text-lg font-semibold text-gray-600 mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between border-r-2 border-black shadow-sm hover:shadow-xl p-2">
            <p className="text-md font-semibold text-gray-500">{stat.title}:</p>
            <p className="text-xl mr-16 font-bold text-blue-600">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
