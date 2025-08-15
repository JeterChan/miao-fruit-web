import React from 'react';
import ImageCarousel from './ImageCarousel';
import ProductCard from './ProductCard';

const ProductList = ({ products, carouselImages, onAddToCart, productTab }) => {
  return (
    <div>
      {/* 產品展示輪播 */}
      {carouselImages.length > 0 && <ImageCarousel images={carouselImages} />}
      
      {/* 產品說明區塊 */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {productTab === 'single' ? '單層禮盒系列' : '雙粒裝禮盒系列'}
          </h2>
          <p className="text-gray-600">
            {productTab === 'single' 
              ? '香甜可口好滋味・脆口多汁有夠讚，自家栽種都是咱好選擇！' 
              : '精選特大顆水梨，口感絕佳，適合重要場合送禮使用'}
          </p>
        </div>
      </div>

      {/* 產品網格 - 根據 Header 選擇的 productTab 顯示對應產品 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {(productTab === 'single' ? products.singleLayer : products.doubleLayer).map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;