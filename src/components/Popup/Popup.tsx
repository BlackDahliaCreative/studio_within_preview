import { useEffect, useRef, ReactNode } from 'react';
import './popup.scss';
import { faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string; // for per-use styling variants
};

export default function Popup({ isOpen, onClose, children, className = '' }: PopupProps) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) dialog.showModal();
        if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);

    return (
        <dialog
            ref={ref}
            className={`popup ${className}`}
            onClose={onClose} // fires on Esc too
            onClick={(e) => e.target === ref.current && onClose()} // click on backdrop closes
        >
            <button className="popup__close" onClick={onClose} aria-label="Close">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
            {children}
        </dialog>
    );
}