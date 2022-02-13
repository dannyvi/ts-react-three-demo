import React from 'react';
import BasicShader from 'pages/Containers/Basic';
import Tokyo from 'pages/Containers/Tokyo';
import Skining from 'pages/Containers/SkiningBlending';
import LightProbe from 'pages/Containers/LightProbe';
import { Link, Route } from 'react-router-dom';
import LightBird from '../pages/Containers/LightBird';

export const scenes = [BasicShader, Tokyo, Skining, LightProbe, LightBird];

export const sceneToRoutes = <React.Fragment>
  {scenes.map((scene: any) => <Route key={scene.name} path={scene.name} element={scene()}/>)}
</React.Fragment>;

export const sceneToLinks = <React.Fragment>
  {scenes.map((scene: any) => <li key={scene.name}>
    <Link to={scene.name}>{scene.name}</Link>
  </li>)}
</React.Fragment>;

