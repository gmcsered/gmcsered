import { type HTMLAttributes, type ReactNode, useEffect, useRef, useState } from "react";
import { churchContent } from "../../content/churchContent";

type RevealProps = {
  as?: "div" | "section" | "article" | "figure" | "aside";
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Reveal({ as: Component = "div", className = "", children, ...props }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(!churchContent.visualFeatures.scrollReveal);

  useEffect(() => {
    if (!churchContent.visualFeatures.scrollReveal || reduceMotion()) {
      setVisible(true);
      return undefined;
    }

    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Component ref={ref as never} className={`reveal ${visible ? "is-visible" : ""} ${className}`} {...props}>
      {children}
    </Component>
  );
}
