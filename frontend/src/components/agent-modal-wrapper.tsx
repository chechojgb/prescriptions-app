'use client';
import React, { useEffect, useState } from 'react';

const AgentModalWrapper = ({ children, closeModal }: any) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(closeModal, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center transition-all duration-500 ${
        show ? 'bg-[#371851]/20 backdrop-blur-md' : 'bg-transparent backdrop-blur-0'
      }`}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`mx-4 transform transition-all duration-300 ease-out w-full max-w-md ${
          show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        } bg-white/80 dark:bg-[#0f0a1a]/80 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl`}
      >
        {children}
      </div>
    </div>
  );
};

export default AgentModalWrapper;