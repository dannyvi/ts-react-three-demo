import React from 'react'
import GLView from 'GLView'
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export default function Tokyo() {
  function onContextCreate(canvas: HTMLCanvasElement) {
    let mixer: any;

    const clock = new THREE.Clock();

    const renderer = new THREE.WebGLRenderer({ canvas , antialias: true})
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;

    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbfe3dd );
    scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

    const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set( 5, 2, 8 );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0.5, 0 );
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    let manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
      console.log(
        "Started loading file: " +
        url +
        ".\nLoaded " +
        itemsLoaded +
        " of " +
        itemsTotal +
        " files."
      );
    };
    manager.onLoad = function () {
      console.log("Loading complete!");
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      console.log(
        "Loading file: " +
        url +
        ".\nLoaded " +
        itemsLoaded +
        " of " +
        itemsTotal +
        " files."
      );
    };

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/draco/gltf/' );
    const loader = new GLTFLoader();

    loader.setDRACOLoader( dracoLoader );
    console.log('parsing')
    loader.load( '/models/LittlestTokyo.glb', function ( gltf ) {
      var obj = gltf.scene.children[0];
      const model = gltf.scene;
      model.position.set( 1, 1, 0 );
      model.scale.set( 0.01, 0.01, 0.01 );
      scene.add( model );

      mixer = new THREE.AnimationMixer( model );
      mixer.clipAction( gltf.animations[ 0 ] ).play();

      animate();

    }, undefined, function ( e ) {

      console.error( e );

    } );


    window.onresize = function () {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

    };
    function animate() {

      requestAnimationFrame( animate );

      const delta = clock.getDelta();

      mixer.update( delta );

      controls.update();

      // stats.update();

      renderer.render( scene, camera );

    }
  }
  return <GLView onContextCreate={onContextCreate}/>
}
