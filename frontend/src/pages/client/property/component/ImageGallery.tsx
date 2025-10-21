'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { imageVariants } from '@/lib/animation';
import { Button } from '@/components/ui/button';

interface Image {
  largeUrl: string;
  thumbnailUrl: string;
  alt: string;
}

interface ImageGalleryProps {
  images: Image[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const currentIndex = page % images.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleThumbnailClick = (index: number) => {
    const newDirection = index > currentIndex ? 1 : -1;
    setPage([index, newDirection]);
  };
  
  if (!images || images.length === 0) {
    return <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">No Images</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={images[currentIndex].largeUrl}
            alt={images[currentIndex].alt}
            custom={direction}
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute h-full w-full object-cover"
          />
        </AnimatePresence>
        <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8"
            onClick={() => paginate(-1)}
        >
            <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8"
            onClick={() => paginate(1)}
        >
            <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <motion.div
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className="relative cursor-pointer rounded-md overflow-hidden aspect-square"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img
              src={image.thumbnailUrl}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {currentIndex === index && (
              <motion.div
                className="absolute inset-0 border-2 border-primary rounded-md"
                layoutId="active-thumbnail-border"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
