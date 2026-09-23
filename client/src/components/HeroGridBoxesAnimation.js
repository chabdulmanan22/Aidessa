import React, { useEffect, useRef } from 'react';

const HeroGridBoxesAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;
    let mouse = { x: -1000, y: -1000 };

    // Dual Palette: Mix of deep dark greens and vibrant light greens on #F8E7C9 base
    const DARK_SHADES = [
      { r: 4, g: 60, b: 45, baseAlpha: 0.90, label: 'deepSolid' },
      { r: 6, g: 78, b: 59, baseAlpha: 0.82, label: 'deepForest' },
      { r: 10, g: 95, b: 71, baseAlpha: 0.74, label: 'richEmerald' },
      { r: 16, g: 110, b: 84, baseAlpha: 0.65, label: 'pineGreen' },
    ];

    const LIGHT_SHADES = [
      { r: 34, g: 168, b: 124, baseAlpha: 0.62, label: 'vibrantMint' },
      { r: 52, g: 194, b: 146, baseAlpha: 0.52, label: 'brightMint' },
      { r: 92, g: 186, b: 152, baseAlpha: 0.44, label: 'softSage' },
      { r: 130, g: 210, b: 180, baseAlpha: 0.36, label: 'lightMint' },
      { r: 160, g: 222, b: 198, baseAlpha: 0.28, label: 'paleMint' },
    ];

    let cells = [];
    let cols = 0;
    let rows = 0;
    let cellW = 44;
    let cellH = 36;

    const generateGrid = () => {
      cells = [];
      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;

      // Clean modular cell dimensions: smaller on mobile for rich mosaic detail
      cellW = isMobile ? 22 : isTablet ? 32 : 44;
      cellH = isMobile ? 18 : isTablet ? 26 : 36;
      cols = Math.ceil(width / cellW) + 1;
      rows = Math.ceil(height / cellH) + 1;

      // Header clear rows: protect logo and top menu
      const headerClearRows = isMobile ? 3 : 2;

      // Vertical text zone on mobile: starts around row 5 and ends around row 19
      const textRowStart = isMobile ? 5 : 4;
      const textRowEnd = isMobile ? 19 : 14;

      for (let r = 0; r < rows; r++) {
        if (r < headerClearRows) continue;

        const isTextRowBand = r >= textRowStart && r <= textRowEnd;
        const isBottomOpenArea = r > textRowEnd;

        // Left-side stepped protrusion:
        const leftWave = isMobile
          ? (isBottomOpenArea ? Math.sin(r * 0.5 + 1.2) * 2.2 + 2.2 : Math.sin(r * 0.7 + 1.4) * 1.1 + 0.9)
          : Math.sin(r * 0.8 + 1.2) * 2.0 + 1.8;
        const leftMaxCol = Math.floor(leftWave);

        // Right-side stepped protrusion:
        const rightWave = isMobile
          ? (isBottomOpenArea ? Math.cos(r * 0.55 + 2.0) * 2.2 + 2.2 : Math.cos(r * 0.65 + 2.3) * 1.1 + 0.9)
          : Math.cos(r * 0.7 + 2.1) * 2.4 + 2.0;
        const rightSteps = Math.floor(rightWave);
        const rightMinCol = rightSteps >= 0 ? cols - 1 - rightSteps : cols;

        for (let c = 0; c < cols; c++) {
          const isLeftEdge = leftMaxCol >= 0 && c <= leftMaxCol;
          const isRightEdge = rightMinCol < cols && c >= rightMinCol;
          const isEdge = isLeftEdge || isRightEdge;

          const isCenterCol = c >= 2 && c <= cols - 3;
          const isInsideTextZone = isTextRowBand && isCenterCol;

          let shouldSpawn = false;
          let isDark = false;
          let shade;
          let opacityMultiplier = 1.0;

          if (isEdge) {
            // Edge mosaic: stepped column clusters
            shouldSpawn = true;
            const distFromEdge = isLeftEdge ? c : (cols - 1 - c);
            if (distFromEdge <= 1) {
              isDark = Math.random() > 0.28;
            } else {
              isDark = Math.random() > 0.50;
            }
            shade = isDark
              ? DARK_SHADES[Math.floor(Math.random() * DARK_SHADES.length)]
              : LIGHT_SHADES[Math.floor(Math.random() * LIGHT_SHADES.length)];
          } else if (isBottomOpenArea) {
            // BOTTOM NON-TEXT AREA:
            // Heavily populated with rich clusters of mixed light and dark green boxes
            const clusterNoise = Math.sin(c * 0.75 + r * 0.9) * Math.cos(r * 0.45 - c * 0.5);
            if (clusterNoise > -0.28 || Math.random() < (isMobile ? 0.52 : 0.36)) {
              shouldSpawn = true;
              isDark = Math.random() > 0.48; // balanced mix of dark green and light green
              if (isDark) {
                shade = DARK_SHADES[Math.floor(Math.random() * DARK_SHADES.length)];
                opacityMultiplier = 0.88;
              } else {
                shade = LIGHT_SHADES[Math.floor(Math.random() * LIGHT_SHADES.length)];
                opacityMultiplier = 0.92;
              }
            }
          } else if (isInsideTextZone) {
            // INSIDE TEXT ZONE:
            // Keep subtle, airy, and strictly soft light mint so text readability remains 100%
            const centerNoise = Math.sin(c * 0.95 + r * 1.3) * Math.cos(r * 0.6 - c * 0.4);
            if (centerNoise > 0.58 && Math.random() > 0.55) {
              shouldSpawn = true;
              isDark = false;
              shade = LIGHT_SHADES[Math.floor(Math.random() * LIGHT_SHADES.length)];
              opacityMultiplier = 0.30;
            }
          } else {
            // Upper sides outside text
            if (Math.random() < 0.40) {
              shouldSpawn = true;
              isDark = Math.random() > 0.5;
              shade = isDark
                ? DARK_SHADES[Math.floor(Math.random() * DARK_SHADES.length)]
                : LIGHT_SHADES[Math.floor(Math.random() * LIGHT_SHADES.length)];
              opacityMultiplier = 0.65;
            }
          }

          if (shouldSpawn && shade) {
            const entranceDelay = isLeftEdge
              ? (c * 0.08 + (r % 4) * 0.05)
              : isRightEdge
                ? ((cols - c) * 0.08 + (r % 4) * 0.05)
                : (0.2 + (r / rows) * 0.6 + (c / cols) * 0.4);

            cells.push({
              col: c,
              row: r,
              x: c * cellW,
              y: r * cellH,
              w: cellW - 1.5, // 1.5px clean matte gap
              h: cellH - 1.5,
              r: shade.r,
              g: shade.g,
              b: shade.b,
              baseAlpha: shade.baseAlpha * opacityMultiplier,
              // Continuous active animation parameters
              pulseSpeed: 1.4 + Math.random() * 2.2,
              pulseDepth: 0.28 + Math.random() * 0.32,
              phase: c * 0.4 + r * 0.6 + Math.random() * Math.PI,
              shimmerSpeed: 0.9 + Math.random() * 1.6,
              shimmerPhase: Math.random() * Math.PI * 2,
              scalePulseSpeed: 1.2 + Math.random() * 1.8,
              entranceDelay,
              growDuration: 0.7 + Math.random() * 0.4,
              isDark,
              isBottom: isBottomOpenArea,
            });
          }
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      generateGrid();
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    };

    const onTouchEnd = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    let startTime = null;
    let time = 0;

    const draw = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      time += 0.024; // Smooth continuous clock

      ctx.clearRect(0, 0, width, height);

      // Subtle background grid guides in #064E3B at 3.5% opacity
      ctx.strokeStyle = 'rgba(6, 78, 59, 0.035)';
      ctx.lineWidth = 1;
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cellW, 0);
        ctx.lineTo(c * cellW, height);
        ctx.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cellH);
        ctx.lineTo(width, r * cellH);
        ctx.stroke();
      }

      // Draw each animated mosaic cell
      cells.forEach((cell) => {
        if (elapsed < cell.entranceDelay) return;

        const growElapsed = elapsed - cell.entranceDelay;
        const progress = Math.min(1.0, growElapsed / cell.growDuration);
        const easeOut = 1.0 - Math.pow(1.0 - progress, 3);

        // Continuous active breathing animation:
        // Visible oscillation between (1 - pulseDepth) and 1.0
        const pulse = (1 - cell.pulseDepth) + cell.pulseDepth * (0.5 + 0.5 * Math.sin(time * cell.pulseSpeed + cell.phase));

        // Periodic shimmer / highlight wave that sweeps through tiles
        const shimmer = Math.pow(Math.max(0, Math.sin(time * cell.shimmerSpeed + cell.shimmerPhase)), 3) * 0.32;

        // Mouse or touch hover glow
        const centerX = cell.x + cell.w / 2;
        const centerY = cell.y + cell.h / 2;
        const dx = mouse.x - centerX;
        const dy = mouse.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let hoverGlow = 0;
        if (dist < 140) {
          hoverGlow = (1 - dist / 140) * 0.4;
        }

        // Final calculated opacity
        const alpha = Math.min(1.0, (cell.baseAlpha * pulse * easeOut) + shimmer + hoverGlow);

        // Subtle micro-scale tile breathing (±3%) so the grid feels constantly alive
        const breathingFactor = 1.0 + 0.03 * Math.sin(time * cell.scalePulseSpeed + cell.phase);
        const currentW = Math.max(2, cell.w * (0.85 + 0.15 * easeOut) * breathingFactor);
        const currentH = Math.max(2, cell.h * (0.85 + 0.15 * easeOut) * breathingFactor);
        const offsetX = (cell.w - currentW) / 2;
        const offsetY = (cell.h - currentH) / 2;

        ctx.fillStyle = `rgba(${cell.r}, ${cell.g}, ${cell.b}, ${alpha})`;
        ctx.fillRect(cell.x + offsetX, cell.y + offsetY, currentW, currentH);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};

export default HeroGridBoxesAnimation;
