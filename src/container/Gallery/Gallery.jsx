import React, { useRef, useEffect } from 'react';
import { BsInstagram, BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import { SubHeading } from '../../components';
import { images } from '../../constants';
import './Gallery.css';

const Gallery = () => {
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    const maxScrollLeft = current.scrollWidth - current.clientWidth;

    let scrollDistance = 200; // Default scroll distance

    // Adjust scroll distance for small screens
    if (window.innerWidth <= 768) {
      scrollDistance = current.clientWidth; // Scroll by the container's width
    }

    if (direction === 'left') {
      current.scrollLeft -= scrollDistance;
    } else {
      current.scrollLeft += scrollDistance;
    }

    // Check if reached the end of the list
    if (direction === 'right' && current.scrollLeft >= maxScrollLeft) {
      // If at the end, scroll back to the beginning
      current.scrollLeft = 0;
    }
  };

  useEffect(() => {
    // Define the interval function
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        scroll('right'); // Auto-scroll to the right
      }, 3000); // Adjust the interval as needed (3000 milliseconds = 3 seconds)
    };

    // Start auto-scrolling when the component mounts
    startAutoScroll();

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []); // Empty dependency array ensures this effect runs only once, on mount

  return (
    <div className="app__gallery flex__center flex-col app__bg py-16 px-8 xl:px-24 xl:flex-row">
      <div className="app__gallery-images flex-one flex flex-row max-w-[90%] relative  mt-40">
        <div className="app__gallery-images_container flex flex-row w-max overflow-x-scroll" ref={scrollRef}>
          {[images.gallery01, images.gallery02, images.gallery03, images.gallery04].map((image, index) => (
            <div className="app__gallery-images_card relative min-w-[320px] h-[320px] mr-8 flex__center sm:min-w-[447px] sm:h-[447px]" key={`gallery_image-${index + 1}`}>
              <img src={image} alt="gallery_image" className="w-full h-full object-cover opacity-100 duration-500 ease-in-out" />
              <BsInstagram className="gallery__image-icon absolute text-primary-white text-size-4xl opacity-0 duration-500 ease-in-out cursor-pointer" />
            </div>
          ))}
        </div>
        <div className="app__gallery-images_arrows w-full flex justify-between items-center py-0 px-4 absolute bottom-[5%]">
          <BsArrowLeftShort className="gallery__arrow-icon text-primary-golden text-size-4xl cursor-pointer bg-primary-black rounded-md hover:text-primary-white" onClick={() => scroll('left')} />
          <BsArrowRightShort className="gallery__arrow-icon text-primary-golden text-size-4xl cursor-pointer bg-primary-black rounded-md hover:text-primary-white" onClick={() => scroll('right')} />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
