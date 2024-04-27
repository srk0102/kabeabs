import React from 'react';

import { images } from '../../constants';
import './AboutUs.css';

const AboutUs = () => (
  <div className="relative app__bg flex__center section__padding" id="about">
    <div className="absolute inset-0 flex__center">
    </div>

    <div className="w-full z-2 flex__center flex-col lg:flex-row">
      <div className=" flex-one flex justify-end items-end flex-col text-right">
        <h1 className="headtext__cormorant">About Us</h1>
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans mx-0 my-6 text-primary-gray">Celebrate the essence of Kebabs and Wraps, where each bite narrates a tale of rich flavors and timeless traditions. Our dedication to crafting tantalizing kebabs and wraps distinguishes us. Embark on a culinary journey with us, where every dish harmonizes taste and authenticity. Enter our realm, where every wrap is a work of art and every kebab an adventure. Prepare to immerse yourself in the quintessence of Kebabs and Wraps – where perfection is fueled by passion.</p>
        <button type="button" className="custom__button">Know More</button>
      </div>

     
    </div>
  </div>
);

export default AboutUs;
