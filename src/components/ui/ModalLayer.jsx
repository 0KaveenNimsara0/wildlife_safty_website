import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Native top-layer dialogs escape every header/transform stacking context.
export default function ModalLayer({ children, className = '', onClose, label = 'Dialog' }) {
 const ref = useRef(null);
 const closeRef = useRef(onClose);
 closeRef.current = onClose;
 useEffect(() => {
  const dialog = ref.current;
  const previous = document.activeElement;
  dialog.showModal();
  return () => { dialog.close(); if (previous?.isConnected) previous.focus?.(); };
 }, []);
 return createPortal(<dialog ref={ref} aria-label={label}
  onCancel={event => { event.preventDefault(); closeRef.current?.(); }}
  onClick={event => { if(event.target === event.currentTarget) closeRef.current?.(); }}
  className={`modal-layer ${className}`}>{children}</dialog>,document.body);
}
