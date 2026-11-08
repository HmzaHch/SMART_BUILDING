import React, { useState, useEffect } from 'react';
import Building3D from './components/Building3D';
import { supabase } from './supabaseClient';

export default function App() {
  const [sensorData, setSensorData] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    // 1. Latest single row for the 3D view
    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error(error);
        setStatus(`Error: ${error.message}`);
        return;
      }
      setSensorData(data);
    };

    // 2. Last 50 rows for chart history
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (!error && data) setHistory(data);
    };

    fetchLatest();
    fetchHistory();

    // 3. Realtime — updates 3D + appends to history
    const channel = supabase
      .channel('sensor_readings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sensor_readings' },
        (payload) => {
          setSensorData(payload.new);
          setHistory((prev) => {
            const next = [...prev, payload.new];
            if (next.length > 50) next.shift();
            return next;
          });
          setStatus(`Updated ${new Date(payload.new.created_at).toLocaleTimeString()}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 100,
          background: 'rgba(0,0,0,0.85)',
          color: '#00ff88',
          padding: '10px 16px',
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '13px',
          border: '1px solid #00ff88',
        }}
      >
        {status} | History: {history.length} pts
      </div>
      <Building3D data={sensorData} history={history} />
    </>
  );
}