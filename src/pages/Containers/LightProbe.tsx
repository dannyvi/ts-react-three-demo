import GLView from '../../GLView';
import * as THREE from 'three';
import React from 'react';
import GUI from 'lil-gui';
import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function LightProbe() {
  function onContextCreate(canvas: HTMLCanvasElement) {
    let mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>, renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera;

    let gui;

    let lightProbe: THREE.LightProbe;
    let directionalLight: THREE.DirectionalLight;

    // linear color space
    const API = {
      lightProbeIntensity: 1.0,
      directionalLightIntensity: 0.2,
      envMapIntensity: 1
    };
    init();

    function init() {

      // renderer
      renderer = new THREE.WebGLRenderer({ canvas , antialias: true})
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      // document.body.appendChild( renderer.domElement );

      // tone mapping
      renderer.toneMapping = THREE.NoToneMapping;

      renderer.outputEncoding = THREE.sRGBEncoding;

      // scene
      scene = new THREE.Scene();

      // camera
      camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
      camera.position.set( 0, 0, 30 );

      // controls
      const controls = new OrbitControls( camera, renderer.domElement );
      controls.addEventListener( 'change', render );
      controls.minDistance = 10;
      controls.maxDistance = 50;
      controls.enablePan = false;

      // probe
      lightProbe = new THREE.LightProbe();
      scene.add( lightProbe );

      // light
      directionalLight = new THREE.DirectionalLight( 0xffffff, API.directionalLightIntensity );
      directionalLight.position.set( 10, 10, 10 );
      scene.add( directionalLight );

      // envmap
      const genCubeUrls = function ( prefix: any, postfix: any ) {

        return [
          prefix + 'px' + postfix, prefix + 'nx' + postfix,
          prefix + 'py' + postfix, prefix + 'ny' + postfix,
          prefix + 'pz' + postfix, prefix + 'nz' + postfix
        ];

      };

      const urls = genCubeUrls( '/textures/cube/pisa/', '.png' );

      new THREE.CubeTextureLoader().load( urls, function ( cubeTexture ) {

        cubeTexture.encoding = THREE.sRGBEncoding;

        scene.background = cubeTexture;

        lightProbe.copy( LightProbeGenerator.fromCubeTexture( cubeTexture ) );

        const geometry = new THREE.SphereGeometry( 5, 64, 32 );
        //const geometry = new THREE.TorusKnotGeometry( 4, 1.5, 256, 32, 2, 3 );

        const material = new THREE.MeshStandardMaterial( {
          color: 0xffffff,
          metalness: 0,
          roughness: 0,
          envMap: cubeTexture,
          envMapIntensity: API.envMapIntensity,
        } );

        // mesh
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        render();

      } );


      // gui
      gui = new GUI( { title: 'Intensity' } );

      gui.add( API, 'lightProbeIntensity', 0, 1, 0.02 )
        .name( 'light probe' )
        .onChange( function () {

          lightProbe.intensity = API.lightProbeIntensity; render();

        } );

      gui.add( API, 'directionalLightIntensity', 0, 1, 0.02 )
        .name( 'directional light' )
        .onChange( function () {

          directionalLight.intensity = API.directionalLightIntensity; render();

        } );

      gui.add( API, 'envMapIntensity', 0, 1, 0.02 )
        .name( 'envMap' )
        .onChange( function () {

          mesh.material.envMapIntensity = API.envMapIntensity; render();

        } );

      // listener
      window.addEventListener( 'resize', onWindowResize );

    }

    function onWindowResize() {

      renderer.setSize( window.innerWidth, window.innerHeight );

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      render();

    }

    function render() {

      renderer.render( scene, camera );

    }
  }

  return <GLView onContextCreate={onContextCreate}/>
}
