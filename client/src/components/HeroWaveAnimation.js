import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const HeroWaveAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Authentic Glass Optical Fiber Waves (S-Curve, Staggered Emergence & Undulating Flow)
    const strandCount = 36;
    const strands = [];

    // 4 batches of 9 strands each, emerging every 0.5 seconds
    for (let i = 0; i < strandCount; i++) {
      const batchIndex = Math.floor(i / 9); // 0, 1, 2, 3
      const progress = (i % 9) / 9;

      strands.push({
        index: i,
        batchIndex,
        // Staggered emergence: Batch 0 at 0.4s, then every 0.5s (0.9s, 1.4s, 1.9s)
        delay: 0.4 + batchIndex * 0.5,
        growDuration: 1.4, // smooth time to travel across the full curve
        // Spread & fan offsets
        xOffset: (i - strandCount / 2) * 6,
        yOffset: ((i % 6) - 3) * 7,
        cp1Offset: ((i % 9) - 4.5) * 8,
        cp2Offset: (i - strandCount / 2) * 11,
        yEndOffset: (i - strandCount / 2) * 16,
        // Glass fiber physical dimensions
        baseWidth: 0.70 + (i % 3 === 0 ? 0.35 : 0),
        pulseWidth: 1.35 + (i % 4 === 0 ? 0.45 : 0),
        // Traveling light pulse characteristics (halki halki cruising speed)
        pulseLength: 90 + (i % 5) * 30,
        gapLength: 190 + (i % 7) * 35,
        travelSpeed: 20 + (i % 4) * 5,
        // Glass color scheme
        colorScheme: i % 4 === 0 ? 'cyan' : i % 4 === 1 ? 'mint' : i % 4 === 2 ? 'cream' : 'white',
        opacity: 0.32 + Math.sin(progress * Math.PI) * 0.55,
        phase: (i / strandCount) * Math.PI * 2,
      });
    }

    // de Casteljau algorithm for smooth mathematical Bezier curve growth
    const subdivideBezier = (p0, p1, p2, p3, t) => {
      if (t >= 0.999) return { p0, p1, p2, p3 };
      const lerp = (a, b, factor) => ({
        x: a.x + (b.x - a.x) * factor,
        y: a.y + (b.y - a.y) * factor,
      });

      const p01 = lerp(p0, p1, t);
      const p12 = lerp(p1, p2, t);
      const p23 = lerp(p2, p3, t);

      const p012 = lerp(p01, p12, t);
      const p123 = lerp(p12, p23, t);

      const p0123 = lerp(p012, p123, t);

      return { p0, p1: p01, p2: p012, p3: p0123 };
    };

    let time = 0;
    let startTime = null;

    const draw = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000; // in seconds
      time += 0.011;

      ctx.clearRect(0, 0, width, height);

      // Trajectory matching the reference image:
      // Starts on the left under the CTA button, flows horizontally dipping into a valley,
      // sweeps dramatically UPWARD in an undulating wave crest through the panels, and fans out to the top-right.
      const baseStartX = width * 0.18;
      const baseStartY = height * 0.78;

      const cp1X = width * 0.44;
      const cp1Y = height * 0.82; // gentle valley dip under the button

      const cp2X = width * 0.68;
      const cp2Y = height * 0.44; // dramatic upward wave crest swoop!

      const endX = width * 1.06;
      const endY = height * 0.15; // upper-right exit

      strands.forEach((strand) => {
        // Staggered emergence check
        if (elapsed < strand.delay) {
          return; // this batch has not started yet
        }

        // Calculate growth progress (0 to 1) with cubic ease-out
        const growElapsed = elapsed - strand.delay;
        const rawProgress = Math.min(1.0, growElapsed / strand.growDuration);
        const drawProgress = 1.0 - Math.pow(1.0 - rawProgress, 3);

        // "Lehrati hui" multi-frequency harmonic wave undulations
        const wave1 = Math.sin(time * 1.2 + strand.phase) * 8 + Math.cos(time * 0.7 + strand.phase * 0.6) * 5;
        const wave2 = Math.cos(time * 0.95 + strand.phase * 1.2) * 10 + Math.sin(time * 1.4 + strand.phase) * 6;
        const wave3 = Math.sin(time * 1.1 + strand.phase * 0.8) * 8;

        // Base wave control points
        const fullP0 = {
          x: baseStartX + strand.xOffset,
          y: baseStartY + strand.yOffset,
        };
        const fullP1 = {
          x: cp1X + strand.cp1Offset + wave1 * 0.3,
          y: cp1Y + strand.yOffset * 0.5 + wave1,
        };
        const fullP2 = {
          x: cp2X + strand.cp2Offset + wave2 * 0.3,
          y: cp2Y + strand.cp2Offset * 0.4 + wave2,
        };
        const fullP3 = {
          x: endX,
          y: endY + strand.yEndOffset + wave3 * 0.4,
        };

        // Get currently drawn partial or full curve
        const { p0, p1, p2, p3 } = subdivideBezier(fullP0, fullP1, fullP2, fullP3, drawProgress);

        // Feathered gradient along curve: 0% opacity at bottom origin (zero cut), luminous middle, 0% exit
        const fiberGrad = ctx.createLinearGradient(p0.x, p0.y, p3.x, p3.y);
        fiberGrad.addColorStop(0, 'rgba(52, 211, 153, 0)'); // completely invisible blended origin
        fiberGrad.addColorStop(0.10, 'rgba(52, 211, 153, ' + (strand.opacity * 0.4) + ')');

        if (strand.colorScheme === 'cyan') {
          fiberGrad.addColorStop(0.40, 'rgba(103, 232, 249, ' + (strand.opacity * 0.8) + ')');
          fiberGrad.addColorStop(0.72, 'rgba(255, 255, 255, ' + (strand.opacity * 0.95) + ')');
        } else if (strand.colorScheme === 'mint') {
          fiberGrad.addColorStop(0.40, 'rgba(52, 211, 153, ' + (strand.opacity * 0.85) + ')');
          fiberGrad.addColorStop(0.72, 'rgba(167, 243, 208, ' + (strand.opacity * 0.95) + ')');
        } else if (strand.colorScheme === 'cream') {
          fiberGrad.addColorStop(0.40, 'rgba(248, 231, 201, ' + (strand.opacity * 0.8) + ')');
          fiberGrad.addColorStop(0.72, 'rgba(255, 253, 247, ' + (strand.opacity * 0.95) + ')');
        } else {
          fiberGrad.addColorStop(0.40, 'rgba(255, 255, 255, ' + (strand.opacity * 0.8) + ')');
          fiberGrad.addColorStop(0.72, 'rgba(167, 243, 208, ' + (strand.opacity * 0.9) + ')');
        }

        fiberGrad.addColorStop(0.92, 'rgba(52, 211, 153, ' + (strand.opacity * 0.35) + ')');
        fiberGrad.addColorStop(1, 'rgba(52, 211, 153, 0)');

        // 1. GLASS CLADDING SHEEN (Soft refractive glass halo)
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.setLineDash([]);
        ctx.strokeStyle = fiberGrad;
        ctx.lineWidth = strand.baseWidth * 2.4;
        ctx.globalAlpha = 0.16;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // 2. CRYSTALLINE GLASS CORE (Ultra-fine sharp filament)
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.strokeStyle = fiberGrad;
        ctx.lineWidth = strand.baseWidth;
        ctx.stroke();

        // 3. TRAVELLING LIGHT SIGNALS INSIDE FIBER (Gentle cruising speed)
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.setLineDash([strand.pulseLength, strand.gapLength]);
        ctx.lineDashOffset = -time * strand.travelSpeed;
        ctx.lineCap = 'round';
        ctx.lineWidth = strand.pulseWidth;

        // Bright photonic pulse gradient
        const pulseGrad = ctx.createLinearGradient(p0.x, p0.y, p3.x, p3.y);
        pulseGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        pulseGrad.addColorStop(0.15, 'rgba(167, 243, 208, 0.45)');
        pulseGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.98)');
        pulseGrad.addColorStop(0.80, 'rgba(248, 231, 201, 0.90)');
        pulseGrad.addColorStop(1, 'rgba(52, 211, 153, 0)');

        ctx.strokeStyle = pulseGrad;
        ctx.stroke();

        // 4. Leading Photon Spark at advancing tip during initial emergence
        if (drawProgress < 0.98) {
          ctx.beginPath();
          ctx.arc(p3.x, p3.y, 2.4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#34D399';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Exact Vector Geometric Panels matching the reference screenshot */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* True Luminance Right-edge Blend Mask to softly fade panels into the canvas */}
          <mask id="rightBlendMask" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1600" height="840" fill="url(#rightBlendGrad)" />
          </mask>
          <linearGradient id="rightBlendGrad" x1="850" y1="0" x2="1420" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#888888" />
            <stop offset="88%" stopColor="#222222" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          {/* Panel 1 (Nichy Wala): Rich solid matte finishing in HEX #064E3B */}
          <linearGradient id="mattePanelGrad" x1="790" y1="190" x2="1350" y2="840" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#064E3B" />
            <stop offset="60%" stopColor="#054232" />
            <stop offset="100%" stopColor="#032D22" />
          </linearGradient>

          {/* Panel 2 (Upar Wala): Frosted Glass Effect translucent fill */}
          <linearGradient id="glassPanelGrad" x1="930" y1="310" x2="1440" y2="840" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#085A44" stopOpacity="0.48" />
            <stop offset="50%" stopColor="#064E3B" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#032E23" stopOpacity="0.58" />
          </linearGradient>

          {/* Subtle interior glass sheen */}
          <linearGradient id="glassSheenGrad" x1="930" y1="310" x2="1320" y2="620" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFDF7" stopOpacity="0.16" />
            <stop offset="40%" stopColor="#34D399" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#064E3B" stopOpacity="0" />
          </linearGradient>

          {/* Frosted Glass Bevel Border */}
          <linearGradient id="glassBorderGrad" x1="930" y1="310" x2="1400" y2="700" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8E7C9" stopOpacity="0.45" />
            <stop offset="30%" stopColor="#34D399" stopOpacity="0.30" />
            <stop offset="70%" stopColor="#F8E7C9" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#04382A" stopOpacity="0.40" />
          </linearGradient>
        </defs>

        {/* Ambient atmospheric depth behind panels */}
        <ellipse
          cx="1150"
          cy="460"
          rx="380"
          ry="300"
          fill="#064E3B"
          fillOpacity="0.18"
          filter="blur(70px)"
        />

        {/* Wrapped in right blend mask to seamlessly fade into canvas on the right */}
        <g mask="url(#rightBlendMask)">
          {/* ================= PANEL 1 (NICHY WALA - BASE MATTE PANEL) ================= */}
          {/* Continuous diagonal downward slope extending offscreen without any vertical cut */}
          <motion.g
            initial={{ y: 220, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <path
              d="M 760 840 L 950 230 Q 965 190 1005 190 L 1180 190 Q 1215 190 1240 220 L 1600 540 L 1600 840 Z"
              fill="url(#mattePanelGrad)"
            />
          </motion.g>

          {/* ================= PANEL 2 (UPAR WALA - FROSTED GLASS PANEL) ================= */}
          {/* Continuous diagonal slope extending offscreen with glass styling */}
          <motion.g
            initial={{ y: 260, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1.0,
              delay: 1.0,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Glass panel translucent body */}
            <path
              d="M 910 840 L 1050 350 Q 1065 310 1105 310 L 1280 310 Q 1315 310 1340 340 L 1600 580 L 1600 840 Z"
              fill="url(#glassPanelGrad)"
              stroke="url(#glassBorderGrad)"
              strokeWidth="1.5"
            />
            {/* Soft internal glass sheen reflection */}
            <path
              d="M 910 840 L 1050 350 Q 1065 310 1105 310 L 1280 310 Q 1315 310 1340 340 L 1600 580 L 1600 840 Z"
              fill="url(#glassSheenGrad)"
            />
          </motion.g>
        </g>
      </svg>

      {/* Right-edge feathering blend overlay into #F8E7C9 canvas for natural smooth finish */}
      <div className="absolute top-0 right-0 bottom-0 w-1/3 max-w-lg pointer-events-none bg-gradient-to-l from-[#F8E7C9] via-[#F8E7C9]/70 to-transparent z-[5]" />

      {/* Canvas for Sweeping Multi-Strand Wave Ribbons & Particle Dots */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block relative z-10"
      />
    </div>
  );
};

export default HeroWaveAnimation;
