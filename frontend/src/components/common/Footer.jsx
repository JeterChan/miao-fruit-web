import React from 'react';

const Footer = () => (
  <footer className="bg-gray-800 text-white py-8 mt-16">
    <div className="container mx-auto px-4 text-center">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">妙媽媽果園</h3>
        <p className="text-gray-300">只限「郵局宅配」運送（週一～週四寄貨）</p>
      </div>

      <p className="text-gray-400 text-sm mt-4">
        ※ 匯款完成後，請務必告知「帳號末5碼」及「匯款金額」
      </p>
      <div className="mt-6 flex justify-center">
        <a href="https://lin.ee/WutLX5j" target="_blank" rel="noopener noreferrer">
          <img 
            src="/images/QRcode_black.jpg" 
            alt="QR Code" 
            className="w-24 h-24 hover:opacity-80 transition-opacity"
          />
        </a>
      </div>

    </div>
  </footer>
);

export default Footer;