import React, { FC, PropsWithChildren, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useMounted } from "../../hooks/useMounted";

import css from "./Modal.module.css";

interface IModal {
  open?: boolean;
  onClose?: () => any;
}

export const Modal: FC<PropsWithChildren<IModal>> = ({ children, open, onClose }) => {
  const isMounted = useMounted();
  const domRef = useRef<HTMLElement>();

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") onClose && onClose();
    }
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);
  if (!isMounted || typeof window === "undefined" || !open || !domRef.current) return null;

  useEffect(() => {
    domRef.current = document.createElement("div");
    domRef.current.id = "modal";
    document.body.appendChild(domRef.current);
    return () => {
      domRef.current?.remove();
    };
  });

  return ReactDOM.createPortal(
    <>
      <div className={css.modal__wrapper}>
        <div className={css.modal}>
          <div className={css.modal__content}>
            <span className={css.modal__times} onClick={onClose}>
              &times;
            </span>
            {children}
          </div>
        </div>
        <div className={css.modal_overlay} onClick={onClose} />
      </div>
    </>,
    domRef.current
  );
};
