import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactElement<{ onClose: () => void }>;
  zIndex?: number; // allows stacking modals
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  children,
  zIndex = 50,
}) => {
  const [show, setShow] = useState(isOpen);

  // Track open/close state for animation
  useEffect(() => {
    if (isOpen) setShow(true);
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    // delay unmount until animation finishes
    setTimeout(() => onClose(), 300);
  };

  // ESC key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!show) return;
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center p-2"
          style={{ zIndex }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Overlay (slightly transparent for stacked modals) */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={handleClose}
          />

          {/* Modal content */}
          <motion.div
            className="z-10 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {React.cloneElement(children, { onClose: handleClose })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalWrapper;
