type MotifProps = {
  className?: string;
};

export function CrossMotif({ className = "" }: MotifProps) {
  return (
    <svg className={`motif motif--cross ${className}`} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <path d="M60 18v84M34 43h52" />
      <path d="M26 102h68" />
    </svg>
  );
}

export function BibleMotif({ className = "" }: MotifProps) {
  return (
    <svg className={`motif motif--bible ${className}`} viewBox="0 0 160 96" aria-hidden="true" focusable="false">
      <path d="M80 22c-17-13-38-13-58-5v61c20-8 41-8 58 5 17-13 38-13 58-5V17c-20-8-41-8-58 5Z" />
      <path d="M80 22v61M35 34c12-3 23-2 33 3M35 49c12-3 23-2 33 3M92 37c10-5 21-6 34-3M92 52c10-5 21-6 34-3" />
    </svg>
  );
}

export function LightRays({ className = "" }: MotifProps) {
  return (
    <svg className={`motif motif--rays ${className}`} viewBox="0 0 220 160" aria-hidden="true" focusable="false">
      <path d="M110 150V52M57 134l33-84M163 134l-33-84M23 104l56-62M197 104l-56-62M6 63l68-31M214 63l-68-31" />
    </svg>
  );
}

export function ScriptureDivider({ className = "" }: MotifProps) {
  return (
    <div className={`scripture-divider ${className}`} aria-hidden="true">
      <span />
      <CrossMotif />
      <span />
    </div>
  );
}

export function SectionOrnament({ className = "" }: MotifProps) {
  return (
    <svg className={`motif motif--ornament ${className}`} viewBox="0 0 220 120" aria-hidden="true" focusable="false">
      <path d="M20 95c44-50 91-64 180-70" />
      <path d="M51 74c-10-7-19-8-31-4 5 10 13 15 27 15M105 50c-12-10-23-12-39-7 8 12 18 18 34 18M156 35c-8-10-17-14-31-13 4 12 13 20 28 23" />
    </svg>
  );
}
