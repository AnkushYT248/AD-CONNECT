
import React from 'react';

export const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <dialog open className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        {children}
      </div>
    </dialog>
  );
};

export default Dialog;
