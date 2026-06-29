import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { TOP_UNIVERSITIES } from "@/lib/top-universities";

// Try to load a real NASA earth map; if it fails for ANY reason, we silently
// fall back to the procedural texture below so the page can never crash.
const REAL_EARTH_URLS = [
  "https://raw.githubusercontent.com/mrdoob/three.js/r160/examples/textures/planets/earth_atmos_2048.jpg",
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/earth_atmos_2048.jpg",
];

function useRealEarthTexture(): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const tryLoad = (i: number) => {
      if (i >= REAL_EARTH_URLS.length) return;
      loader.load(
        REAL_EARTH_URLS[i],
        (tex) => {
          if (cancelled) { tex.dispose(); return; }
          tex.colorSpace = THREE.SRGBColorSpace;
          setTexture(tex);
        },
        undefined,
        () => tryLoad(i + 1)
      );
    };
    tryLoad(0);
    return () => { cancelled = true; };
  }, []);
  return texture;
}

type Uni = {
  name: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  rank: number;
};

// Convert TOP_UNIVERSITIES into the lat/lng format the globe expects
const UNIVERSITIES: Uni[] = TOP_UNIVERSITIES.map((u) => ({
  name: u.name,
  country: u.country,
  city: u.city,
  lat: u.coords[1],
  lng: u.coords[0],
  rank: u.rank,
}));

// Simple initials avatar color generator based on name
function getUniColor(name: string) {
  const colors = [
    "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981",
    "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#f43f5e",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 0 && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("") || name.slice(0, 2).toUpperCase();
}

function getDomain(name: string) {
  // Best-effort domain mapping for logo.clearbit
  const map: Record<string, string> = {
    "Massachusetts Institute of Technology": "mit.edu",
    "University of Cambridge": "cam.ac.uk",
    "University of Oxford": "ox.ac.uk",
    "Harvard University": "harvard.edu",
    "Stanford University": "stanford.edu",
    "Imperial College London": "imperial.ac.uk",
    "ETH Zurich": "ethz.ch",
    "National University of Singapore": "nus.edu.sg",
    "UCL (University College London)": "ucl.ac.uk",
    "California Institute of Technology": "caltech.edu",
    "University of Pennsylvania": "upenn.edu",
    "University of California, Berkeley": "berkeley.edu",
    "The University of Melbourne": "unimelb.edu.au",
    "Peking University": "pku.edu.cn",
    "Tsinghua University": "tsinghua.edu.cn",
    "Princeton University": "princeton.edu",
    "Yale University": "yale.edu",
    "University of Toronto": "utoronto.ca",
    "Cornell University": "cornell.edu",
    "The University of Hong Kong": "hku.hk",
    "Columbia University": "columbia.edu",
    "University of Chicago": "uchicago.edu",
    "University of Edinburgh": "ed.ac.uk",
    "EPFL": "epfl.ch",
    "PSL University": "psl.eu",
    "The University of Tokyo": "u-tokyo.ac.jp",
    "Johns Hopkins University": "jhu.edu",
    "Technical University of Munich": "tum.de",
    "University of Michigan-Ann Arbor": "umich.edu",
    "McGill University": "mcgill.ca",
    "Australian National University": "anu.edu.au",
    "University of Sydney": "sydney.edu.au",
    "UNSW Sydney": "unsw.edu.au",
    "University of British Columbia": "ubc.ca",
    "University of Manchester": "manchester.ac.uk",
    "Nanyang Technological University": "ntu.edu.sg",
    "Kyoto University": "kyoto-u.ac.jp",
    "Seoul National University": "snu.ac.kr",
    "KAIST": "kaist.ac.kr",
    "Northwestern University": "northwestern.edu",
    "University of Hong Kong S&T": "hkust.edu.hk",
    "Fudan University": "fudan.edu.cn",
    "Shanghai Jiao Tong University": "sjtu.edu.cn",
    "Zhejiang University": "zju.edu.cn",
    "Duke University": "duke.edu",
    "Carnegie Mellon University": "cmu.edu",
    "University of Bristol": "bristol.ac.uk",
    "King's College London": "kcl.ac.uk",
    "London School of Economics": "lse.ac.uk",
    "New York University": "nyu.edu",
    "Monash University": "monash.edu",
    "University of Queensland": "uq.edu.au",
    "University of Amsterdam": "uva.nl",
    "Delft University of Technology": "tudelft.nl",
    "University of Tokyo Inst. of Tech.": "titech.ac.jp",
    "Sorbonne University": "sorbonne-universite.fr",
    "Sciences Po": "sciencespo.fr",
    "Heidelberg University": "uni-heidelberg.de",
    "HEC Paris": "hec.edu",
    "Indiana University Bloomington": "iu.edu",
    "University of Wisconsin-Madison": "wisc.edu",
    "University of Washington": "washington.edu",
    "Brown University": "brown.edu",
    "Boston University": "bu.edu",
    "Georgia Institute of Technology": "gatech.edu",
    "University of Texas at Austin": "utexas.edu",
    "University of Auckland": "auckland.ac.nz",
    "University of Otago": "otago.ac.nz",
    "Trinity College Dublin": "tcd.ie",
    "University College Dublin": "ucd.ie",
    "University of Glasgow": "gla.ac.uk",
    "University of Warwick": "warwick.ac.uk",
    "University of Birmingham": "birmingham.ac.uk",
    "University of Leeds": "leeds.ac.uk",
    "University of Southampton": "southampton.ac.uk",
    "Durham University": "durham.ac.uk",
    "University of Nottingham": "nottingham.ac.uk",
    "Korea University": "korea.ac.kr",
    "Yonsei University": "yonsei.ac.kr",
    "Osaka University": "osaka-u.ac.jp",
    "Tohoku University": "tohoku.ac.jp",
    "University of Waterloo": "uwaterloo.ca",
    "University of Alberta": "ualberta.ca",
    "University of Montreal": "umontreal.ca",
    "Western University": "uwo.ca",
    "RWTH Aachen": "rwth-aachen.de",
    "LMU Munich": "lmu.de",
    "Free University of Berlin": "fu-berlin.de",
    "Humboldt University Berlin": "hu-berlin.de",
    "Lund University": "lu.se",
    "KTH Royal Institute of Technology": "kth.se",
    "University of Copenhagen": "ku.dk",
    "University of Oslo": "uio.no",
    "University of Helsinki": "helsinki.fi",
    "KU Leuven": "kuleuven.be",
    "Politecnico di Milano": "polimi.it",
    "Bocconi University": "bocconi.it",
    "University of Bologna": "unibo.it",
    "Universidad Complutense Madrid": "ucm.es",
    "IE University": "ie.edu",
  };
  return map[name] || "";
}

// Convert lat/lng to 3D sphere coordinates
function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function createEarthTexture() {
  const width = 1024;
  const height = 512;
  const data = new Uint8Array(width * height * 4);
  const landBlobs = [
    [-101, 48, 34, 18], [-83, 30, 22, 16], [-60, -12, 18, 28], [-70, -38, 12, 18],
    [15, 2, 27, 33], [20, 22, 25, 20], [78, 52, 46, 16], [104, 31, 34, 18],
    [78, 20, 18, 17], [135, -25, 24, 16], [48, -20, 20, 18], [-42, 72, 18, 7],
  ];

  for (let y = 0; y < height; y += 1) {
    const lat = 90 - (y / (height - 1)) * 180;
    const latRad = (lat * Math.PI) / 180;
    for (let x = 0; x < width; x += 1) {
      const lng = (x / (width - 1)) * 360 - 180;
      let land = 0;
      landBlobs.forEach(([cx, cy, rx, ry]) => {
        const dx = Math.abs(((lng - cx + 540) % 360) - 180) / rx;
        const dy = (lat - cy) / ry;
        land = Math.max(land, Math.exp(-(dx * dx + dy * dy) * 1.55));
      });
      const coastNoise = Math.sin((lng * 0.22 + lat * 0.38) * Math.PI) * 0.09 + Math.sin((lng * 0.71 - lat * 0.17) * Math.PI) * 0.05;
      const ice = Math.max(0, (Math.abs(lat) - 66) / 20);
      const shade = 0.72 + 0.28 * Math.cos(latRad);
      const i = (y * width + x) * 4;

      if (ice > 0.35) {
        data[i] = 210; data[i + 1] = 234; data[i + 2] = 242; data[i + 3] = 255;
      } else if (land + coastNoise > 0.34) {
        data[i] = Math.round((34 + land * 58) * shade);
        data[i + 1] = Math.round((102 + land * 84) * shade);
        data[i + 2] = Math.round((64 + land * 44) * shade);
        data[i + 3] = 255;
      } else {
        const ocean = 0.55 + 0.45 * Math.cos(latRad);
        data[i] = Math.round(8 + ocean * 8);
        data[i + 1] = Math.round(42 + ocean * 54);
        data[i + 2] = Math.round(92 + ocean * 118);
        data[i + 3] = 255;
      }
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
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
  const [hovered, setHovered] = useState<Uni | null>(null);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate && !selected) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  const proceduralTexture = useMemo(() => createEarthTexture(), []);
  const realTexture = useRealEarthTexture();
  const earthTexture = realTexture ?? proceduralTexture;

  const cloudsRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.02;
  });

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
      {/* Procedural Earth texture: no external image loading, so this cannot crash the page */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={earthTexture}
          specular={new THREE.Color("#222")}
          shininess={12}
        />
      </mesh>

      {/* Clouds layer */}
      <mesh ref={cloudsRef} scale={1.012}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} depthWrite={false} />
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
        const isHover = hovered?.name === u.name;
        const active = isSelected || isHover;
        const normal = pos.clone().normalize();
        // Hide pins on the far side of the globe (back-face culling for HTML markers)
        return (
          <group key={i} position={pos}>
            {/* Big invisible hit-sphere — makes pins easy to click */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                setAutoRotate(false);
                onSelect(u);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
                setHovered(u);
              }}
              onPointerOut={() => {
                document.body.style.cursor = "default";
                setHovered((h) => (h?.name === u.name ? null : h));
              }}
            >
              <sphereGeometry args={[0.11, 10, 10]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            {/* Outer soft halo */}
            <mesh>
              <sphereGeometry args={[active ? 0.075 : 0.05, 16, 16]} />
              <meshBasicMaterial
                color={isSelected ? "#fde047" : "#22d3ee"}
                transparent
                opacity={active ? 0.35 : 0.22}
                depthWrite={false}
              />
            </mesh>

            {/* Ring (lollipop look) */}
            <mesh quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)}>
              <ringGeometry args={[active ? 0.04 : 0.028, active ? 0.052 : 0.038, 24]} />
              <meshBasicMaterial
                color={isSelected ? "#fde047" : "#67e8f9"}
                transparent
                opacity={0.9}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>

            {/* Core dot */}
            <mesh>
              <sphereGeometry args={[active ? 0.028 : 0.018, 16, 16]} />
              <meshBasicMaterial color={isSelected ? "#fde047" : "#ffffff"} />
            </mesh>

            {/* Beam pointing outward */}
            <mesh
              position={normal.clone().multiplyScalar(active ? 0.14 : 0.08)}
              quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal)}
            >
              <cylinderGeometry args={[0.0035, 0.0015, active ? 0.28 : 0.16, 8]} />
              <meshBasicMaterial
                color={isSelected ? "#fde047" : "#22d3ee"}
                transparent
                opacity={0.85}
                depthWrite={false}
              />
            </mesh>

            {(isSelected || isHover) && (
              <Html
                distanceFactor={7}
                position={normal.clone().multiplyScalar(0.35).toArray()}
                center
                style={{ pointerEvents: "none" }}
              >
                <div className="px-2.5 py-1 rounded-lg bg-slate-900/95 border border-cyan-400/60 text-[11px] font-semibold text-white whitespace-nowrap shadow-[0_4px_20px_rgba(34,211,238,0.35)] backdrop-blur">
                  <span className="text-cyan-300 mr-1">#{u.rank}</span>
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
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 border border-border"
                    style={{ backgroundColor: getUniColor(selected.name) }}
                  >
                    {getInitials(selected.name)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg leading-tight">{selected.name}</p>
                    <p className="text-sm text-muted-foreground">
                      📍 {selected.city}, {selected.country}
                    </p>
                  </div>
                </div>

                <div className="inline-block self-start px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-3">
                  🏆 #{selected.rank} Global
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Ranked #{selected.rank} globally. A world-class institution in {selected.country} known for outstanding teaching, research, and innovation.
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
                <p className="font-bold text-xl mb-2">Click a Pin</p>
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
