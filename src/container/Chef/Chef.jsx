import React from 'react';

import { SubHeading } from '../../components';
import { images } from '../../constants';
import './Chef.css';

const Chef = () => (
  <div className="app__bg app__wrapper section__padding">
    <div className="app__wrapper_img app__wrapper_img-reverse">
      <img src={images.logo} alt="chef_image" />
    </div>
    <div className="app__wrapper_info flex justify-start items-start">
      <SubHeading title="Chef's word"/>
      <h1 className="headtext__cormorant">What we believe in</h1>

      <div className="app__chef-content flex flex-col w-full mt-10">
        <div className="app__chef-content_quote flex justify-start items-end">
          <img src={images.quote} alt="quote_image" className='w-[47px] h-[40px] mt-0 mr-4 mb-4 ml-0'/>
          <p className="p__opensans">We believe in crafting dishes that are made fresh, bursting with natural flavors, and imbued with the essence of fire..</p>
        </div>
      </div>

      <div className="app__chef-sign wi-full mt-10">
        <p className=' font-CormorantUpright font-normal text-[32px] leading-9 tracking-wider capitalize text-primary-golden '>MULLAI</p>
        <p className="p__opensans">Chef & Founder</p>
      </div>
    </div>
  </div>
);

export default Chef;
