import React, { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './FloatingTooltip.module.css';

interface FloatingTooltipProps {
  content: string;
  targetRect: DOMRect | null;
  visible: boolean;
}

export default function FloatingTooltip({ content, targetRect, visible }: FloatingTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!targetRect || !tooltipRef.current || !visible) return;

    const tooltip = tooltipRef.current;
    const { width, height } = tooltip.getBoundingClientRect();
    const { top, left, width: targetWidth } = targetRect;
    
    // Default position: centered above the target, 0px gap
    let newTop = top - height;
    let newLeft = left + (targetWidth / 2) - (width / 2);

    // Check right edge
    if (newLeft + width > window.innerWidth - 10) {
      newLeft = window.innerWidth - width - 10;
    }

    // Check left edge
    if (newLeft < 10) {
      newLeft = 10;
    }

    // Check top edge (if runs off top, flip to bottom)
    if (newTop < 10) {
      newTop = top + targetRect.height + 10; // Position below with 10px gap
    }

    setPosition({ top: newTop, left: newLeft });
  }, [targetRect, content, visible]);

  if (!visible || !content) return null;

  return createPortal(
    <div 
      ref={tooltipRef}
      className={`${styles.tooltip} ${visible ? styles.visible : ''}`}
      style={{ top: position.top, left: position.left }}
    >
      {content}
    </div>,
    document.body
  );
}