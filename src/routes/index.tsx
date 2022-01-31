/* */
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from '../pages/Home';
import NotFound from '../pages/404';
import BasicShader from '../pages/Containers/Basic';
// import your route components too

export default function Router () {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}>
        {/*<Route index element={<Home />} />*/}
        {/*<Route path="teams" element={<Teams />}>*/}
        {/*  <Route path=":teamId" element={<Team />} />*/}
        {/*  <Route path="new" element={<NewTeamForm />} />*/}
        {/*  <Route index element={<LeagueStandings />} />*/}
        {/*</Route>*/}
      </Route>
      <Route path="/ex1" element={<BasicShader />}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
}
