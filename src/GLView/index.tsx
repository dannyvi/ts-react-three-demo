import React, { useEffect } from 'react'
function randomString(length: number, chars: string) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export default function GLView({ onContextCreate }: {onContextCreate: any}) {
  const id = randomString(32, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const _onContextCreate = () => {
    const canvas = document.querySelector(`#${id}`);
    return onContextCreate(canvas)
  }
  useEffect(_onContextCreate, [id, onContextCreate])
  return <div style={{ width: '100%', height: '100%' }}>
    <canvas id={id} style={{ width: '100%', height: '100%', display: 'block'}}/>
  </div>
}
