import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState({});
  const [loadingImages, setLoadingImages] = useState(true);

  // 自動輪播功能
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [images.length]);

  // 載入實際圖片
  useEffect(() => {
    const loadImages = async () => {
      const urls = {};
      
      const imageFiles = [
        'images/two-piece.jpg', // 雙粒裝
        'images/two-piece-box.jpg', // 雙粒裝包裝
        'images/five-piece.jpg', // 5粒裝
        'images/six-piece.jpg', // 6粒裝
        'images/seven-piece.jpg', // 7粒裝
        'images/single-box.jpg', // 外觀包裝-單層
        'images/double-box.jpg',  // 外觀包裝-雙層
        'images/outfit.jpg' // 外觀包裝
      ];
      
      for (let i = 0; i < images.length; i++) {
        try {
          urls[images[i].id] = imageFiles[i];
        } catch (error) {
          console.log(`無法載入圖片 ${imageFiles[i]}，使用備用顯示`);
          urls[images[i].id] = null;
        }
      }
      
      setImageUrls(urls);
      setLoadingImages(false);
    };

    if (images.length > 0) {
      loadImages();
    }
  }, [images]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const getCarouselContent = (image, imageUrl) => {
    if (imageUrl) {
      return (
        <div className="w-full h-full relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={image.title}
            className="w-full h-full object-contain bg-gradient-to-br from-orange-50 to-yellow-50"
            onError={(e) => {
              console.log('圖片載入失敗');
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    }
    
    return (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50">
        {image.id === 1 && <FivePackDisplay />}
        {image.id === 2 && <SixPackDisplay />}
        {image.id === 3 && <SevenPackDisplay />}
        {image.id === 4 && <SingleBoxDisplay />}
        {image.id === 5 && <DoubleBoxDisplay />}
      </div>
    );
  };

  if (loadingImages) {
    return (
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden aspect-[4/3] flex items-center justify-center">
          <div className="text-gray-500">載入圖片中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden aspect-[4/3] group">
        <div className="relative w-full h-full">
          {getCarouselContent(images[currentIndex], imageUrls[images[currentIndex].id])}
          
          {/* 圖片描述覆蓋層 */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h3 className="text-white text-xl font-bold mb-1">{images[currentIndex].title}</h3>
            <p className="text-white/90 text-sm">{images[currentIndex].description}</p>
          </div>

          {/* 上一張按鈕 */}
          {images.length > 1 && (
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* 下一張按鈕 */}
          {images.length > 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>

        {/* 指示點 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* 自動輪播進度條 */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-orange-400 transition-all ease-linear"
            style={{ 
              width: '100%',
              animation: 'progress 4s linear infinite'
            }}
          />
        </div>

        {/* CSS 動畫定義 */}
        <style jsx>{`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
};

// 備用顯示組件保持不變
const FivePackDisplay = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative p-8">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <PearIcon key={i} />
        ))}
      </div>
      <div className="flex justify-center">
        <PearIcon />
      </div>
      <div className="absolute inset-0 border-2 border-dashed border-green-300 rounded-lg"></div>
    </div>
  </div>
);

const SixPackDisplay = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative p-8">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <PearIcon key={i} />
        ))}
      </div>
      <div className="absolute inset-0 border-2 border-dashed border-green-300 rounded-lg"></div>
    </div>
  </div>
);

const SevenPackDisplay = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative p-8">
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative">
            <div className="w-14 h-14 bg-yellow-300 rounded-full shadow-lg border-4 border-green-400 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full absolute -top-1 -right-1"></div>
              <div className="text-yellow-800 text-xs font-bold">梨</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-3">
        <div className="w-14 h-14 bg-yellow-300 rounded-full shadow-lg border-4 border-green-400 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-600 rounded-full absolute -top-1 -right-1"></div>
          <div className="text-yellow-800 text-xs font-bold">梨</div>
        </div>
      </div>
      <div className="absolute inset-0 border-2 border-dashed border-green-300 rounded-lg"></div>
    </div>
  </div>
);

const SingleBoxDisplay = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
    <div className="relative">
      <div className="w-56 h-32 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg shadow-xl border-2 border-blue-200 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-8 bg-red-400 flex items-center justify-center">
          <span className="text-white text-sm font-bold">精選</span>
        </div>
        <div className="text-center mt-4">
          <div className="text-blue-800 font-bold text-lg mb-1">卓蘭特產</div>
          <div className="text-blue-700 text-base font-semibold">高接梨</div>
          <div className="flex items-center justify-center mt-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-full mr-2"></div>
            <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
          </div>
        </div>
        <div className="absolute bottom-2 left-4 right-4 h-6 bg-white/70 rounded flex items-center justify-center">
          <span className="text-gray-700 text-xs">妙媽媽果園 0910567118</span>
        </div>
      </div>
    </div>
  </div>
);

const DoubleBoxDisplay = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
    <div className="relative">
      <div className="w-56 h-36 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg shadow-xl border-2 border-amber-200 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-2 left-2 text-red-600 text-lg font-bold">梨</div>
        <div className="absolute top-2 right-2 w-8 h-6 bg-red-500 rounded text-white text-xs flex items-center justify-center">印章</div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-12 h-12 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full absolute"></div>
            </div>
            <div className="w-12 h-12 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full absolute"></div>
            </div>
          </div>
          <div className="text-amber-800 font-bold text-sm">Pear Fruit</div>
        </div>
        
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <div className="text-amber-700 text-xs">雙層特級裝</div>
        </div>
      </div>
    </div>
  </div>
);

const PearIcon = () => (
  <div className="relative">
    <div className="w-16 h-16 bg-yellow-300 rounded-full shadow-lg border-4 border-green-400 flex items-center justify-center">
      <div className="w-3 h-3 bg-green-600 rounded-full absolute -top-1 -right-1"></div>
      <div className="text-yellow-800 text-xs font-bold">梨</div>
    </div>
  </div>
);

export default ImageCarousel;