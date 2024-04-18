import React from 'react';

import { SubHeading } from '../../components';
import { images } from '../../constants';
import './Header.css';

const Header = () => (
  <div className="bg-primary-black app__wrapper section__padding font-CormorantUpright text-primary-golden" id="home">
    <div className="flex-1 w-full flex items-start justify-center flex-col">
      <SubHeading title="Chase the Fire" />
      <h1 className="headtext__cormorant font-bold mb-4">Unleash the inferno of flavor</h1>
      <p className="p__opensans mb-4">Where bold spices and intense flavors ignite your taste buds, beckoning you to revel in the thrill of every bite. Feel the passion and heat we infuse into each kebab, setting your senses ablaze with unmatched intensity. </p>
      <a href="#menu" type="button" className="custom__button">Explore Menu</a>
    </div>

    <div className="app__wrapper_img">
      <img src={images.welcome} alt="header_img" />
    </div>
  </div>
);

export default Header;
