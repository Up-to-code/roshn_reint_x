/**
 * PatternDecor
 *
 * Renders the brand pattern SVG as two fixed-edge decorative elements —
 * one anchored to the left edge, one mirrored on the right edge.
 *
 * - Each instance is 28vw wide so it sits flush against its edge without overflow
 * - The SVG viewBox is 922 × 2070 (ratio ≈ 0.445w:1h), so at 28vw wide the
 *   height is ~63vw — tall enough to cover most viewport heights
 * - Both sit at z-index 0 behind all page content
 */
export function PatternDecor() {
  const sides: Array<{ side: "left" | "right"; top: string }> = [
    { side: "left",  top: "5%" },
    { side: "right", top: "5%" },
    { side: "left",  top: "55%" },
    { side: "right", top: "55%" },
  ];

  return (
    <>
      {sides.map((inst, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: inst.top,
            // Flush to the edge — no negative offset so nothing bleeds beyond the container
            [inst.side]: 0,
            width: "28vw",
            aspectRatio: "922 / 2070",
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.9,
            // Mirror the SVG on the right side for a natural look
            transform: inst.side === "right" ? "scaleX(-1)" : "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/النمط copy.svg"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      ))}
    </>
  );
}
