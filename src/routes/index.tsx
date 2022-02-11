import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import { sceneToRoutes } from './scenes';

export default function Router() {
  return <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      {sceneToRoutes}
    </Routes>
  </BrowserRouter>;
}
