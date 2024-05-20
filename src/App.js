import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AboutUs, Chef, FindUs, Footer, Gallery, Header, SpecialMenu } from './container';
import { Navbar, Menu, Dasboard } from './components';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <div>

    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <>
            <Navbar />
            <Gallery />
            <Header />
            <Chef />
            <AboutUs />
            <FindUs />
            <Footer />
          </>
        }
        />
        <Route path="/dashboard" element={<Dasboard />} />
        <Route path="/order-menu" element={<Menu />}>
          {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
