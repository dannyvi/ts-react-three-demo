import React from 'react';
import { Link } from 'react-router-dom';
import { sceneToLinks } from '../routes/scenes';

export default function Home() {
  return <div>
    <li>
      <Link to='/'>home</Link>
    </li>
    {sceneToLinks}
  </div>;
}
