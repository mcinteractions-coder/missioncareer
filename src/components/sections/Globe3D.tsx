import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

type Uni = {
  name: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  domain: string;
  rank: string;
  desc: string;
};

const UNIVERSITIES: Uni[] = [
  // USA
  { name: "Harvard University", country: "USA", city: "Cambridge", lat: 42.3770, lng: -71.1167, domain: "harvard.edu", rank: "#1 Global", desc: "Ivy League. World's most prestigious university." },
  { name: "MIT", country: "USA", city: "Cambridge", lat: 42.3601, lng: -71.0942, domain: "mit.edu", rank: "#2 Global", desc: "Leader in tech, engineering & innovation." },
  { name: "Stanford University", country: "USA", city: "Stanford", lat: 37.4275, lng: -122.1697, domain: "stanford.edu", rank: "#3 Global", desc: "Silicon Valley powerhouse." },
  { name: "Columbia University", country: "USA", city: "New York", lat: 40.8075, lng: -73.9626, domain: "columbia.edu", rank: "#12 Global", desc: "Ivy League in the heart of NYC." },
  { name: "UC Berkeley", country: "USA", city: "Berkeley", lat: 37.8719, lng: -122.2585, domain: "berkeley.edu", rank: "#10 Global", desc: "Top public research university." },
  { name: "Yale University", country: "USA", city: "New Haven", lat: 41.3163, lng: -72.9223, domain: "yale.edu", rank: "#9 Global", desc: "Ivy League excellence since 1701." },
  { name: "Princeton University", country: "USA", city: "Princeton", lat: 40.3431, lng: -74.6551, domain: "princeton.edu", rank: "#16 Global", desc: "Elite Ivy League research." },
  // UK
  { name: "University of Oxford", country: "UK", city: "Oxford", lat: 51.7548, lng: -1.2544, domain: "ox.ac.uk", rank: "#1 UK", desc: "World's oldest English-speaking university." },
  { name: "University of Cambridge", country: "UK", city: "Cambridge", lat: 52.2043, lng: 0.1149, domain: "cam.ac.uk", rank: "#2 UK", desc: "Birthplace of modern science." },
  { name: "Imperial College London", country: "UK", city: "London", lat: 51.4988, lng: -0.1749, domain: "imperial.ac.uk", rank: "#5 Global", desc: "STEM-focused excellence." },
  { name: "UCL", country: "UK", city: "London", lat: 51.5246, lng: -0.1340, domain: "ucl.ac.uk", rank: "#8 Global", desc: "London's leading multidisciplinary uni." },
  { name: "LSE", country: "UK", city: "London", lat: 51.5145, lng: -0.1167, domain: "lse.ac.uk", rank: "#1 Social Sciences", desc: "Top for economics & politics." },
  { name: "University of Edinburgh", country: "UK", city: "Edinburgh", lat: 55.9445, lng: -3.1892, domain: "ed.ac.uk", rank: "#22 Global", desc: "Scotland's flagship university." },
  // Canada
  { name: "University of Toronto", country: "Canada", city: "Toronto", lat: 43.6629, lng: -79.3957, domain: "utoronto.ca", rank: "#1 Canada", desc: "Canada's top research university." },
  { name: "UBC", country: "Canada", city: "Vancouver", lat: 49.2606, lng: -123.2460, domain: "ubc.ca", rank: "#2 Canada", desc: "Stunning west-coast campus." },
  { name: "McGill University", country: "Canada", city: "Montreal", lat: 45.5048, lng: -73.5772, domain: "mcgill.ca", rank: "#3 Canada", desc: "The Harvard of Canada." },
  { name: "University of Waterloo", country: "Canada", city: "Waterloo", lat: 43.4723, lng: -80.5449, domain: "uwaterloo.ca", rank: "Top CS", desc: "Best for tech & co-op programs." },
  // Australia
  { name: "University of Melbourne", country: "Australia", city: "Melbourne", lat: -37.7964, lng: 144.9612, domain: "unimelb.edu.au", rank: "#1 Australia", desc: "Australia's leading research uni." },
  { name: "University of Sydney", country: "Australia", city: "Sydney", lat: -33.8886, lng: 151.1873, domain: "sydney.edu.au", rank: "#2 Australia", desc: "Australia's first university." },
  { name: "ANU", country: "Australia", city: "Canberra", lat: -35.2777, lng: 149.1185, domain: "anu.edu.au", rank: "Top research", desc: "National research powerhouse." },
  { name: "UNSW Sydney", country: "Australia", city: "Sydney", lat: -33.9173, lng: 151.2313, domain: "unsw.edu.au", rank: "Top Engineering", desc: "Leader in engineering & business." },
  { name: "University of Queensland", country: "Australia", city: "Brisbane", lat: -27.4975, lng: 153.0137, domain: "uq.edu.au", rank: "Top 50", desc: "Sun-soaked campus excellence." },
  // Germany
  { name: "TU Munich", country: "Germany", city: "Munich", lat: 48.1497, lng: 11.5680, domain: "tum.de", rank: "#1 Germany", desc: "Engineering & tech leader." },
  { name: "LMU Munich", country: "Germany", city: "Munich", lat: 48.1508, lng: 11.5800, domain: "lmu.de", rank: "Top research", desc: "Germany's flagship university." },
  { name: "Heidelberg University", country: "Germany", city: "Heidelberg", lat: 49.4099, lng: 8.7060, domain: "uni-heidelberg.de", rank: "Top research", desc: "Germany's oldest university." },
  { name: "RWTH Aachen", country: "Germany", city: "Aachen", lat: 50.7785, lng: 6.0593, domain: "rwth-aachen.de", rank: "Top Engineering", desc: "Premier engineering school." },
  // Others
  { name: "ETH Zurich", country: "Switzerland", city: "Zurich", lat: 47.3763, lng: 8.5483, domain: "ethz.ch", rank: "#7 Global", desc: "Europe's MIT." },
  { name: "Trinity College Dublin", country: "Ireland", city: "Dublin", lat: 53.3438, lng: -6.2546, domain: "tcd.ie", rank: "#1 Ireland", desc: "Ireland's most prestigious uni." },
  { name: "NUS", country: "Singapore", city: "Singapore", lat: 1.2966, lng: 103.7764, domain: "nus.edu.sg", rank: "#8 Global", desc: "Asia's top university." },
  { name: "NTU Singapore", country: "Singapore", city: "Singapore", lat: 1.3483, lng: 103.6831, domain: "ntu.edu.sg", rank: "#15 Global", desc: "World-class research." },
  { name: "University of Tokyo", country: "Japan", city: "Tokyo", lat: 35.7126, lng: 139.7619, domain: "u-tokyo.ac.jp", rank: "#1 Japan", desc: "Japan's top university." },
  { name: "University of Auckland", country: "New Zealand", city: "Auckland", lat: -36.8523, lng: 174.7691, domain: "auckland.ac.nz", rank: "#1 NZ", desc: "NZ's leading research uni." },
  { name: "TU Delft", country: "Netherlands", city: "Delft", lat: 52.0022, lng: 4.3736, domain: "tudelft.nl", rank: "Top Engineering", desc: "Europe's engineering elite." },
  { name: "Sorbonne University", country: "France", city: "Paris", lat: 48.8462, lng: 2.3447, domain: "sorbonne-universite.fr", rank: "Top France", desc: "Historic Parisian excellence." },
  { name: "HKU", country: "Hong Kong", city: "Hong Kong", lat: 22.2830, lng: 114.1371, domain: "hku.hk", rank: "#17 Global", desc: "Asia's global gateway." },
];

// Convert lat/lng to 3D sphere coordinates
function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function Earth({
  onSelect,
  selected,
}: {
  onSelect: (u: Uni | null) => void;
  selected: Uni | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate && !selected) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  // Procedural earth texture via gradient shader (no external image needed)
  const earthMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec2 vUv;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec2 vUv;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0,0,1.0)), 2.0);
            vec3 deep = vec3(0.02, 0.08, 0.25);
            vec3 mid = vec3(0.05, 0.25, 0.55);
            vec3 glow = vec3(0.2, 0.6, 1.0);
            vec3 col = mix(deep, mid, vUv.y);
            col += glow * intensity * 0.6;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  );

  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0,0,1.0)), 3.0);
            gl_FragColor = vec4(0.3, 0.7, 1.0, 1.0) * intensity;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      }),
    []
  );

  return (
    <group ref={groupRef}>
      {/* Earth sphere */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      {/* Wireframe overlay for grid lines */}
      <mesh>
        <sphereGeometry args={[2.005, 32, 32]} />
        <meshBasicMaterial
          color="#4dd0e1"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.15}>
        <sphereGeometry args={[2, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* University pins */}
      {UNIVERSITIES.map((u, i) => {
        const pos = latLngToVec3(u.lat, u.lng, 2.02);
        const isSelected = selected?.name === u.name;
        return (
          <group key={i} position={pos}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                setAutoRotate(false);
                onSelect(u);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "default";
              }}
            >
              <sphereGeometry args={[isSelected ? 0.06 : 0.035, 16, 16]} />
              <meshBasicMaterial color={isSelected ? "#ffd54f" : "#ff4081"} />
            </mesh>
            {/* Pulsing glow */}
            <mesh>
              <sphereGeometry args={[isSelected ? 0.12 : 0.07, 16, 16]} />
              <meshBasicMaterial
                color={isSelected ? "#ffd54f" : "#ff80ab"}
                transparent
                opacity={0.35}
              />
            </mesh>
            {/* Beam pointing outward */}
            <mesh position={pos.clone().normalize().multiplyScalar(0.15)}>
              <cylinderGeometry args={[0.005, 0.005, 0.3, 8]} />
              <meshBasicMaterial
                color={isSelected ? "#ffd54f" : "#ff4081"}
                transparent
                opacity={0.5}
              />
            </mesh>
            {isSelected && (
              <Html distanceFactor={6} position={[0, 0.2, 0]} center>
                <div className="px-2 py-1 rounded-md bg-background/90 border border-primary text-xs font-semibold whitespace-nowrap shadow-lg backdrop-blur">
                  {u.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export function Globe3D() {
  const [selected, setSelected] = useState<Uni | null>(null);

  return (
    <section id="globe" className="py-20 px-4 bg-gradient-to-b from-background via-background to-background relative overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            🌍 Interactive 3D Globe
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Explore Universities Around the World
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Rotate the globe, click any glowing pin to discover top universities in that location.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-stretch">
          {/* Globe Canvas */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-black h-[560px] shadow-2xl">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1.2} />
              <Suspense fallback={null}>
                <Stars radius={50} depth={50} count={3000} factor={4} fade speed={1} />
                <Earth onSelect={setSelected} selected={selected} />
              </Suspense>
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={3.5}
                maxDistance={10}
                rotateSpeed={0.5}
              />
            </Canvas>
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur border border-white/10 text-xs text-white/80">
              🖱️ Drag to rotate • Scroll to zoom
            </div>
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur border border-white/10 text-xs text-white/80">
              {UNIVERSITIES.length} universities pinned
            </div>
          </div>

          {/* Info Panel */}
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur p-6 shadow-xl flex flex-col">
            {selected ? (
              <div className="animate-fade-in flex flex-col h-full">
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={`https://logo.clearbit.com/${selected.domain}`}
                    alt={selected.name}
                    className="w-14 h-14 rounded-xl bg-white p-1.5 object-contain border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">{selected.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      📍 {selected.city}, {selected.country}
                    </p>
                  </div>
                </div>

                <div className="inline-block self-start px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-3">
                  🏆 {selected.rank}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {selected.desc}
                </p>

                <div className="mt-auto space-y-2">
                  <a
                    href="#booking"
                    className="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:opacity-90 transition"
                  >
                    Get Free Counselling →
                  </a>
                  <button
                    onClick={() => setSelected(null)}
                    className="block w-full text-center px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full py-10">
                <div className="text-6xl mb-4 animate-pulse">🎯</div>
                <h3 className="font-bold text-xl mb-2">Click a Pin</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Tap any glowing pin on the globe to see university details.
                </p>
                <div className="grid grid-cols-2 gap-3 w-full text-xs">
                  <div className="rounded-xl border border-border p-3">
                    <div className="text-2xl font-bold text-primary">{UNIVERSITIES.length}+</div>
                    <div className="text-muted-foreground">Universities</div>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <div className="text-2xl font-bold text-primary">
                      {new Set(UNIVERSITIES.map((u) => u.country)).size}
                    </div>
                    <div className="text-muted-foreground">Countries</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
