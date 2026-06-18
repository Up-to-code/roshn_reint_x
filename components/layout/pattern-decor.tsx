/**
 * PatternDecor
 *
 * Renders the brand pattern SVG as a series of decorative, full-height
 * background elements that repeat at section-height intervals.
 *
 * - Each instance is ~50vw wide (roughly half the screen)
 * - Positions alternate: left → right → left → … (always starting left)
 * - All instances sit behind page content via z-index: 0 / pointer-events: none
 * - The parent wrapper is position:absolute and covers the entire page height
 */
export function PatternDecor() {
  // Define how many pattern instances to render and their side.
  // We render enough to cover long pages; extras are clipped by overflow:hidden.
  const instances: Array<{ side: "left" | "right"; topFraction: number }> = [
    { side: "left",  topFraction: 0.05 },
    { side: "left",  topFraction: 0.22 },
    { side: "right", topFraction: 0.38 },
    { side: "left",  topFraction: 0.55 },
    { side: "left",  topFraction: 0.70 },
    { side: "right", topFraction: 0.85 },
  ];

  return (
    <>
      {instances.map((inst, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: `${inst.topFraction * 100}%`,
            [inst.side]: inst.side === "left" ? "-8vw" : "-8vw",
            width: "50vw",
            // SVG viewBox is 922 × 2070 → ratio ≈ 2.244
            // height is auto (aspect-ratio keeps it proportional)
            aspectRatio: "922 / 2070",
            pointerEvents: "none",
            zIndex: 0,
            opacity: 1,
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
