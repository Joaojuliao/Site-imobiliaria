import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const ImageLightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [onClose, onNext, onPrev]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
                aria-label="Fechar"
            >
                <X className="h-8 w-8" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Previous Button */}
            {images.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                    className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                    aria-label="Imagem anterior"
                >
                    <ChevronLeft className="h-12 w-12" />
                </button>
            )}

            {/* Image */}
            <div
                className="relative max-w-7xl max-h-[90vh] mx-auto px-16"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={images[currentIndex]}
                    alt={`Imagem ${currentIndex + 1}`}
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                    aria-label="Próxima imagem"
                >
                    <ChevronRight className="h-12 w-12" />
                </button>
            )}
        </div>
    );
};

export default ImageLightbox;
