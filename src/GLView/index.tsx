import React, { useEffect } from 'react'

export default function GLView({ onContextCreate }: {onContextCreate: any}) {
  const _onContextCreate = () => {
    const canvas = document.querySelector('#glscene');
    return onContextCreate(canvas)
  }
  useEffect(_onContextCreate, [onContextCreate])
  return <div style={{ width: '100%', height: '100%' }}>
    <canvas id='glscene' style={{ width: '100%', height: '100%', display: 'block'}}/>
  </div>
}
