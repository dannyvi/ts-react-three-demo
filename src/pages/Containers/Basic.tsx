import React from 'react'
import GLView from 'GLView'
import onContextCreate from './cube'

export default function BasicShader() {
  return <GLView onContextCreate={onContextCreate}/>
}
