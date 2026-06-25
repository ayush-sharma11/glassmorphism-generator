import { useState, useCallback, useEffect, useRef } from 'react';

export default function Toast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Copied to clipboard!');
  const timerRef = useRef(null);

  const show = useCallback((msg = 'Copied to clipboard!') => {
    setMessage(msg);
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2200);
  }, []);

  useEffect(() => {
    // Expose the show function globally so any component can trigger it
    window.__showToast = show;
    return () => {
      delete window.__showToast;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show]);

  return (
    <div className={`toast${visible ? ' show' : ''}`} id="toast">
      {message}
    </div>
  );
}
