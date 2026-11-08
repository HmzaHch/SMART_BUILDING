import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Html } from '@react-three/drei';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ─── 3D Zone Block ─── */
function ZoneBlock({ data, onClick }) {
  const meshRef = useRef();
  const temp = data?.temp_c ?? 20;
  const alert = temp > 30;

  const height = Math.min(Math.max(0.5 + temp / 12, 0.5), 4.0);
  const color = alert ? '#e94560' : temp > 25 ? '#ffd700' : '#00ff88';

  useFrame((state) => {
    if (alert && meshRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.08;
      meshRef.current.scale.set(s, s, s);
    } else if (meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Clickable mesh */}
      <Box
        ref={meshRef}
        args={[3, height, 3]}
        position={[0, height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.9}
          emissive={alert ? '#e94560' : '#000000'}
          emissiveIntensity={alert ? 0.5 : 0}
        />
      </Box>

      {/* Floating label — also clickable */}
      <Html position={[0, height + 1.5, 0]} center>
        <div
          onClick={onClick}
          style={{
            background: 'rgba(10,15,30,0.95)',
            padding: '16px 20px',
            borderRadius: '12px',
            border: `2px solid ${color}`,
            color: 'white',
            fontSize: '14px',
            minWidth: '220px',
            fontFamily: 'Segoe UI, sans-serif',
            boxShadow: `0 0 25px ${color}40`,
            lineHeight: 1.6,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              fontWeight: 'bold',
              marginBottom: '10px',
              fontSize: '18px',
              color: '#00d4ff',
            }}
          >
            {data?.zone?.toUpperCase() || 'ZONE'} — {data?.device_id || 'Offline'}
          </div>

          {data ? (
            <>
              <div>🌡️ Temp: <strong>{data.temp_c?.toFixed(1)} °C</strong></div>
              <div>💧 Hum: <strong>{data.hum_pct?.toFixed(1)} %</strong></div>
              <div>🏗️ Vib: <strong>{data.vibration_g?.toFixed(3)} g</strong></div>
              <div>📐 Inc: <strong>{data.inclination_deg?.toFixed(1)} °</strong></div>
              <div>📶 RSSI: <strong>{data.rssi_dbm} dBm</strong></div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: '#94a3b8' }}>
                {new Date(data.created_at).toLocaleTimeString()}
              </div>
            </>
          ) : (
            <div style={{ color: '#64748b' }}>Waiting for data...</div>
          )}

          <div
            style={{
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px solid #1e3a5f',
              color: '#00d4ff',
              fontSize: '12px',
              textAlign: 'center',
            }}
          >
            📊 Click to view charts
          </div>
        </div>
      </Html>
    </group>
  );
}

/* ─── Chart Panel ─── */
function ChartPanel({ history, onClose }) {
  const data = history.map((h) => ({
    time: new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    temp: h.temp_c,
    hum: h.hum_pct,
    vib: h.vibration_g,
    inc: h.inclination_deg,
  }));

  const charts = [
    { title: 'Temperature (°C)', key: 'temp', color: '#e94560' },
    { title: 'Humidity (%)', key: 'hum', color: '#00d4ff' },
    { title: 'Vibration (g)', key: 'vib', color: '#ffd700' },
    { title: 'Inclination (°)', key: 'inc', color: '#00ff88' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '460px',
        background: 'rgba(11, 17, 32, 0.98)',
        borderLeft: '1px solid #1e3a5f',
        zIndex: 50,
        padding: '24px',
        overflowY: 'auto',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ color: '#00d4ff', margin: 0, fontSize: '20px' }}>
          Zone Analytics
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid #e94560',
            color: '#e94560',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ✕
        </button>
      </div>

      {history.length === 0 ? (
        <div style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>
          No historical data yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {charts.map((c) => (
            <div
              key={c.key}
              style={{
                background: 'rgba(15, 52, 96, 0.25)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #1e3a5f',
              }}
            >
              <h4 style={{ color: c.color, margin: '0 0 12px 0', fontSize: '14px' }}>
                {c.title}
              </h4>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id={`g-${c.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={c.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickMargin={5} />
                  <YAxis stroke="#64748b" fontSize={10} width={40} />
                  <Tooltip
                    contentStyle={{
                      background: '#0f172a',
                      border: `1px solid ${c.color}`,
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area
                    type="monotone"
                    dataKey={c.key}
                    stroke={c.color}
                    fill={`url(#g-${c.key})`}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Scene ─── */
export default function Building3D({ data, history }) {
  const [showCharts, setShowCharts] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0b1120', position: 'relative' }}>
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '20px 30px',
          background: 'linear-gradient(90deg, #0f3460, #16213e)',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #1e3a5f',
        }}
      >
        <h1 style={{ color: '#00d4ff', margin: 0, fontSize: '22px' }}>
          Smart Building 3D Monitor
        </h1>
        <div style={{ color: data ? '#00ff88' : '#e94560', fontSize: '14px' }}>
          {data ? '● Live Data Stream' : '○ Waiting for data'}
        </div>
      </div>

      {/* Click hint */}
      {!showCharts && (
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#64748b',
            fontSize: '14px',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          Click the zone block to open charts
        </div>
      )}

      <Canvas camera={{ position: [8, 6, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1} />
        <pointLight position={[-10, 10, -10]} intensity={0.3} color="#00d4ff" />

        <OrbitControls
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={5}
          maxDistance={20}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#0a1929" />
        </mesh>

        <ZoneBlock data={data} onClick={() => setShowCharts(true)} />
      </Canvas>

      {showCharts && <ChartPanel history={history} onClose={() => setShowCharts(false)} />}
    </div>
  );
}