import React from 'react';

import { SubHeading } from '../../components';
import { images } from '../../constants';

const FindUs = () => (
  <div className="app__bg app__wrapper section__padding" id="contact">
    <div className="app__wrapper_info">
      <SubHeading title="Contact" />
      <h1 className="headtext__cormorant" style={{ marginBottom: '3rem' }}>Find Us</h1>
      <div className="app__wrapper-content">
        <p className="p__opensans">026 w Evelyn ave,109,Sunnyvale,CA94086</p>
        <p className="p__cormorant" style={{ color: '#DCCA87', margin: '2rem 0' }}>Opening Hours</p>
        <p className="p__opensans">Sunday - Thursday: 11:00 am - 12:30 am</p>
        <p className="p__opensans">Friday & Saturday: 11:00 am - 01:30 am</p>
      </div>
    </div>

    <div className="app__wrapper_img">
      <img src={images.findus} alt="finus_img" className='md:w-5/6' />
    </div>
  </div>
);

export default FindUs;
