"use client";

import type { PropsWithChildren } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export function Modal({ isOpen, title, onClose, children }: PropsWithChildren<ModalProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-sm text-slate-500">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
