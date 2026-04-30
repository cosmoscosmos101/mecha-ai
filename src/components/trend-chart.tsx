"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function TrendChart({ data, color }: { data: { day: string; n: number }[]; color: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const max = Math.max(1, ...data.map((d) => d.n));
  const w = 600, h = 160, pad = 24;
  const stepX = (w - pad * 2) / Math.max(1, data.length - 1);
  const points = data.map((d, i) => [pad + i * stepX, h - pad - (d.n / max) * (h - pad * 2)] as const);
  const path = points.reduce((acc, [x, y], i) => acc + (i === 0 ? `M${x},${y}` : ` L${x},${y}`), "");
  const area = `${path} L${points[points.length - 1][0]},${h - pad} L${points[0][0]},${h - pad} Z`;

  useEffect(() => {
    if (!ref.current) return;
    const line = ref.current.querySelector<SVGPathElement>("[data-line]");
    if (line) {
      const len = line.getTotalLength();
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(line, { strokeDashoffset: 0, duration: 1.2, ease: "power3.out" });
    }
    gsap.from(ref.current.querySelectorAll<SVGCircleElement>("[data-dot]"), {
      scale: 0, transformOrigin: "center", stagger: 0.06, duration: 0.5, ease: "back.out(2)", delay: 0.3,
    });
  }, [data]);

  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className="w-full h-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${color.replace("#", "")})`} />
      <path data-line d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map(([x, y], i) => (
        <g key={i}>
          <circle data-dot cx={x} cy={y} r={3.5} fill={color} />
        </g>
      ))}
      {data.map((d, i) => (
        <text
          key={d.day}
          x={pad + i * stepX}
          y={h - 4}
          textAnchor="middle"
          fontSize="10"
          fill="#71706B"
          fontFamily="ui-monospace, monospace"
        >
          {d.day.slice(5)}
        </text>
      ))}
    </svg>
  );
}
