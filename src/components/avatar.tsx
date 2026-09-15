/** Initials avatar with a stable hue per person. No external image requests. */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `hsl(${hash} 55% 88%)`,
        color: `hsl(${hash} 45% 28%)`,
      }}
      className="inline-grid shrink-0 place-items-center rounded-full font-semibold"
    >
      {initials}
    </span>
  );
}
