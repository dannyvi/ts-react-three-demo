import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return <div>
    <li>
      <Link to='/'>home</Link>
    </li>
    <li>
      <Link to='/ex1'>ex1</Link>
    </li>
  </div>;
}
