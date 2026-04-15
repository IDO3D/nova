import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HolographicUI({ setUiMode }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.PointLight(0x00ffff, 2);
    light.position.set(2, 3, 4);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x1a1a2e, 1);
    scene.add(ambient);

    // NOVA Core Orb
    const coreGeometry = new THREE.SphereGeometry(1, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x003333,
      wireframe: true
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Floating Panels
    const createPanel = (x, y, z, color) => {
      const geo = new THREE.PlaneGeometry(1.5, 1);
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      const panel = new THREE.Mesh(geo, mat);
      panel.position.set(x, y, z);
      scene.add(panel);
      return panel;
    };

    createPanel(-2, 1, 0, 0x00ffff); // code editor
    createPanel(2, 1, 0, 0x0088ff);  // preview
    createPanel(0, -1.5, -1, 0x004466); // terminal

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      core.rotation.y += 0.005;
      core.rotation.x += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <button onClick={() => setUiMode('normal')} style={{ padding: '10px', background: 'rgba(0,255,255,0.5)', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer' }}>Open NOVA Interface</button>
      </div>
    </>
  );
}