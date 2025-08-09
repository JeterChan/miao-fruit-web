import React from 'react';
import { Phone } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-800 text-white py-8 mt-16">
    <div className="container mx-auto px-4 text-center">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">妙媽媽果園</h3>
        <p className="text-gray-300">只限「郵局宅配」運送（週一～週四寄貨）</p>
      </div>
      <div className="flex justify-center items-center gap-4 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <Phone size={16} />
          <span>訂購專線: 0910-567118</span>
        </div>
      </div>
      <p className="text-gray-400 text-sm mt-4">
        ※ 匯款完成後，請務必告知「匯款帳號末5碼」及「匯款金額」
      </p>
    </div>
  </footer>
);

export default Footer;