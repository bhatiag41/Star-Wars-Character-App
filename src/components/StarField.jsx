import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const StarField = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const starsRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const geometryRef = useRef(null);
  const materialRef = useRef(null);
  const textureRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) {
      console.error('StarField: mountRef.current is null');
      return;
    }

    console.log('StarField: Initializing...');

    // Get responsive particle count
    const getParticleCount = () => {
      const width = window.innerWidth;
      if (width < 768) return 800; // mobile
      if (width < 1024) return 1500; // tablet
      return 3000; // desktop
    };

    let particleCount = getParticleCount();
    const speed = 2; // Increased speed for more visible movement
    const resetZ = -1500; // Closer reset point
    const startZ = -100; // Start closer to camera for better visibility

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    camera.position.z = 0;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Disable for better performance
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    // Ensure canvas is visible and positioned correctly with blur effect
    const canvas = renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-10';
    canvas.style.display = 'block';
    // No CSS blur - using depth-of-field in shader instead
    
    mountRef.current.appendChild(canvas);
    rendererRef.current = renderer;
    
    console.log('StarField: Renderer created, canvas appended to DOM');

    // Create star geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Star colors: white (70%), gold (20%), warm white (10%) - NO BLUE
    const whiteColor = new THREE.Color(1, 1, 1); // Pure white
    const goldColor = new THREE.Color(1, 0.91, 0.12); // #FFE81F - Star Wars yellow
    const warmWhiteColor = new THREE.Color(1, 0.98, 0.9); // Slightly warm white

    // Initialize stars
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Random positions - spread stars in 3D space
      // Stars positioned behind camera (negative Z) so they move toward camera
      positions[i3] = (Math.random() - 0.5) * 2000;
      positions[i3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i3 + 2] = Math.random() * (startZ - resetZ) + resetZ; // From -1500 to -100

      // Random colors based on distribution: 70% white, 20% gold, 10% warm white
      const rand = Math.random();
      let color;
      if (rand < 0.7) {
        color = whiteColor; // 70% - white stars
      } else if (rand < 0.9) {
        color = goldColor; // 20% - gold stars
      } else {
        color = warmWhiteColor; // 10% - warm white stars
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometryRef.current = geometry;

    // Create circular star texture for smooth, glowing stars
    const createStarTexture = () => {
      const size = 64;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      
      // Create gradient for circular glow
      const gradient = context.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const starTexture = createStarTexture();
    textureRef.current = starTexture;

    // Custom shader for depth-of-field effect
    // Stars at focal distance are sharp, stars far/near are blurred (reduced opacity/size)
    const focalDistance = -500; // Focal point in Z space
    const focalRange = 300; // Range of sharp focus
    
    const vertexShader = `
      varying vec3 vColor;
      varying float vDepth;
      uniform float focalDistance;
      uniform float focalRange;
      
      void main() {
        vColor = color;
        
        // Calculate depth from focal point for depth-of-field
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float depth = abs(mvPosition.z - focalDistance);
        vDepth = depth;
        
        // Size attenuation based on distance
        gl_PointSize = 8.0 * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vDepth;
      uniform float focalDistance;
      uniform float focalRange;
      uniform sampler2D pointTexture;
      
      void main() {
        // Calculate depth-of-field blur factor
        // Stars at focal distance are sharp (opacity = 1.0)
        // Stars far from focal distance are blurred (reduced opacity)
        float blurFactor = smoothstep(0.0, focalRange, vDepth);
        float opacity = 1.0 - blurFactor * 0.7; // Reduce opacity for out-of-focus stars
        
        // Circular star shape
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        
        // Apply depth-of-field opacity
        alpha *= opacity;
        
        // Apply color with depth-of-field
        gl_FragColor = vec4(vColor, alpha * 0.95);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        focalDistance: { value: focalDistance },
        focalRange: { value: focalRange },
        pointTexture: { value: starTexture },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });
    materialRef.current = material;

    // Create points system
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
    starsRef.current = stars;
    
    console.log('StarField: Stars created, rendering...');
    console.log('StarField: Camera position:', camera.position);
    console.log('StarField: Stars count:', particleCount);
    console.log('StarField: Renderer canvas:', renderer.domElement);
    
    // Initial render to ensure stars are visible
    renderer.render(scene, camera);
    console.log('StarField: Initial render complete');

    // NO NEBULA - Removed blue nebula for pure black space

    // Mouse tracking for parallax
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const positions = stars.geometry.attributes.position.array;
      const mouseX = mouseRef.current.x * 50;
      const mouseY = mouseRef.current.y * 50;

      // Update camera position for parallax (subtle)
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (mouseY - camera.position.y) * 0.05;

      // Move stars forward and reset when passing camera
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 2] += speed;

        if (positions[i3 + 2] > 0) {
          positions[i3] = (Math.random() - 0.5) * 2000;
          positions[i3 + 1] = (Math.random() - 0.5) * 2000;
          positions[i3 + 2] = resetZ;
        }
      }

      stars.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (mountRef.current && rendererRef.current && rendererRef.current.domElement) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          // Element may already be removed
        }
      }

      // Dispose geometries, materials, and textures
      if (geometryRef.current) geometryRef.current.dispose();
      if (materialRef.current) materialRef.current.dispose();
      if (textureRef.current) textureRef.current.dispose();
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -10,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default StarField;

