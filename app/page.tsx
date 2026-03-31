"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

const fetchPhotos = async () => {
  try {
    const response = await fetch('https://api.unsplash.com/photos/random?count=5&query=nature&client_id=YOUR_ACCESS_KEY');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch photos');
  }
};

const Slideshow = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const data = await fetchPhotos();
        setPhotos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadPhotos();
  }, []);

  useEffect(() => {
    if (isPlaying && photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, photos]);

  const handleNext = () => {
    if (photos.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }
  };

  const handlePrevious = () => {
    if (photos.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    }
  };

  const handlePause = () => setIsPlaying(false);
  const handlePlay = () => setIsPlaying(true);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen">{error}</div>;
  if (photos.length === 0) return <div className="flex justify-center items-center h-screen">No photos available</div>;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-64">
        <Image
          src={photos[currentIndex]?.urls?.regular || ''}
          alt={photos[currentIndex]?.alt_description || 'Nature Image'}
          layout="fill"
          objectFit="cover"
          className="cursor-pointer"
          onClick={() => window.open(photos[currentIndex]?.urls?.full, '_blank')}
        />
      </div>
      <div className="flex mt-4 space-x-4">
        <button
          onClick={handlePrevious}
          disabled={photos.length <= 1}
          className={twMerge('px-4 py-2 bg-blue-500 text-white rounded', photos.length <= 1 && 'opacity-50 cursor-not-allowed')}
        >
          Previous
        </button>
        {isPlaying ? (
          <button onClick={handlePause} className="px-4 py-2 bg-red-500 text-white rounded">
            Pause
          </button>
        ) : (
          <button onClick={handlePlay} className="px-4 py-2 bg-green-500 text-white rounded">
            Play
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={photos.length <= 1}
          className={twMerge('px-4 py-2 bg-blue-500 text-white rounded', photos.length <= 1 && 'opacity-50 cursor-not-allowed')}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Slideshow />
    </div>
  );
}