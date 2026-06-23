import {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

type RunawayButtonProps = {
  avoidRef: RefObject<HTMLElement | null>;
  centralRef: RefObject<HTMLElement | null>;
};

type Point = {
  x: number;
  y: number;
};

type RectLike = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

const SAFE_MARGIN = 18;
const POINTER_TRIGGER_DISTANCE = 150;

function intersects(a: RectLike, b: RectLike, padding = 0) {
  return !(
    a.right < b.left - padding ||
    a.left > b.right + padding ||
    a.bottom < b.top - padding ||
    a.top > b.bottom + padding
  );
}

function rectFromPoint(point: Point, width: number, height: number): RectLike {
  return {
    left: point.x,
    top: point.y,
    right: point.x + width,
    bottom: point.y + height,
  };
}

function randomBetween(min: number, max: number) {
  if (max <= min) {
    return min;
  }

  return min + Math.random() * (max - min);
}

function viewportBounds(button: HTMLElement) {
  const rect = button.getBoundingClientRect();
  const width = Math.max(rect.width, 116);
  const height = Math.max(rect.height, 52);

  return {
    width,
    height,
    maxX: Math.max(SAFE_MARGIN, window.innerWidth - width - SAFE_MARGIN),
    maxY: Math.max(SAFE_MARGIN, window.innerHeight - height - SAFE_MARGIN),
  };
}

export function RunawayButton({ avoidRef, centralRef }: RunawayButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rafRef = useRef<number | null>(null);
  const [isDetached, setIsDetached] = useState(false);
  const [position, setPosition] = useState<Point | null>(null);

  const pickPosition = useCallback(() => {
    const button = buttonRef.current;

    if (!button) {
      return null;
    }

    const bounds = viewportBounds(button);
    const yesRect = avoidRef.current?.getBoundingClientRect() ?? null;
    const centralRect = centralRef.current?.getBoundingClientRect() ?? null;
    const currentRect = button.getBoundingClientRect();

    let fallback: Point = {
      x: randomBetween(SAFE_MARGIN, bounds.maxX),
      y: randomBetween(SAFE_MARGIN, bounds.maxY),
    };

    for (let attempt = 0; attempt < 80; attempt += 1) {
      const candidate = {
        x: randomBetween(SAFE_MARGIN, bounds.maxX),
        y: randomBetween(SAFE_MARGIN, bounds.maxY),
      };
      const candidateRect = rectFromPoint(candidate, bounds.width, bounds.height);
      const farFromCurrent =
        Math.hypot(candidate.x - currentRect.left, candidate.y - currentRect.top) > 120;
      const clearsYes = !yesRect || !intersects(candidateRect, yesRect, 34);
      const clearsCenter = !centralRect || !intersects(candidateRect, centralRect, -24);

      if (clearsYes && farFromCurrent) {
        fallback = candidate;
      }

      if (clearsYes && clearsCenter && farFromCurrent) {
        return candidate;
      }
    }

    return fallback;
  }, [avoidRef, centralRef]);

  const escape = useCallback(() => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = window.requestAnimationFrame(() => {
      const nextPosition = pickPosition();

      if (!nextPosition) {
        return;
      }

      setIsDetached(true);
      setPosition(nextPosition);
    });
  }, [pickPosition]);

  const runFromPointer = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement> | ReactMouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;

      if (!button) {
        escape();
        return;
      }

      const rect = button.getBoundingClientRect();
      const distance = Math.hypot(
        event.clientX - (rect.left + rect.width / 2),
        event.clientY - (rect.top + rect.height / 2),
      );

      if (distance < POINTER_TRIGGER_DISTANCE) {
        escape();
      }
    },
    [escape],
  );

  const blockClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    escape();
  };

  useEffect(() => {
    const onResize = () => {
      if (isDetached) {
        escape();
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [escape, isDetached]);

  const button = (
    <button
      ref={buttonRef}
      className={`choice-button choice-button--no ${isDetached ? 'choice-button--floating' : ''}`}
      style={
        position
          ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
            }
          : undefined
      }
      type="button"
      aria-label="Não, botão que foge"
      onClick={blockClick}
      onFocus={escape}
      onMouseMove={runFromPointer}
      onMouseOver={escape}
      onPointerDown={blockClick}
      onPointerEnter={escape}
      onPointerMove={runFromPointer}
      onTouchStart={escape}
    >
      <span>Não!</span>
      <img src="/emojis/triste.png" alt="" aria-hidden="true" />
    </button>
  );

  return isDetached ? createPortal(button, document.body) : button;
}
