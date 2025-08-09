import React from 'react';

const Header = () => (
  <header className="bg-gradient-to-r from-orange-300 to-yellow-200 shadow-lg">
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
            <div className="absolute -top-2 -right-2 w-12 h-8 bg-green-400 rounded-full transform rotate-12"></div>
            <span className="text-white text-2xl font-bold z-10">妙</span>
          </div>
        </div>
        <div className="ml-4">
          <h1 className="text-3xl font-bold text-gray-800">妙媽媽果園</h1>
          <p className="text-gray-600 text-sm mt-1">香甜可口好滋味・脆口多汁有夠讚</p>
        </div>
      </div>
    </div>
  </header>
);

export default Header;