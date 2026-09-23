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

    // Dual Palette: Balanced mix of deep dark greens and vibrant light greens on #F8E7C9 base
    const DARK_SHADES = [
      { r: 6, g: 78, b: 59, baseAlpha: 0.78, label: 'deepForest' },
      { r: 10, g: 95, b: 71, baseAlpha: 0.68, label: 'richEmerald' },
      { r: 18, g: 112, b: 86, baseAlpha: 0.56, label: 'pineGreen' },
    ];

    const LIGHT_SHADES = [
      { r: 42, g: 162, b: 122, baseAlpha: 0.48, label: 'vibrantMint' },
      { r: 65, g: 180, b: 142, baseAlpha: 0.38, label: 'brightMint' },
      { r: 105, g: 195, b: 165, baseAlpha: 0.28, label: 'softSage' },
      { r: 145, g: 215, b: 188, baseAlpha: 0.18, label: 'lightMint' },
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

      // Clean modular cell dimensions
      cellW = isMobile ? 24 : isTablet ? 34 : 44;
      cellH = isMobile ? 20 : isTablet ? 28 : 36;
      cols = Math.ceil(width / cellW) + 1;
      rows = Math.ceil(height / cellH) + 1;

      // Header clear rows: protect logo and top menu
      const headerClearRows = isMobile ? 3 : 2;

      for (let r = 0; r < rows; r++) {
        if (r < headerClearRows) continue;

        // Left-side stepped protrusion (1-2 columns, occasional 3):
        const leftWave = isMobile
          ? Math.sin(r * 0.7 + 1.4) * 0.85 + 0.55
          : Math.sin(r * 0.8 + 1.2) * 1.5 + 1.2;
        const leftMaxCol = Math.floor(leftWave);

        // Right-side stepped protrusion (1-2 columns, occasional 3):
        const rightWave = isMobile
          ? Math.cos(r * 0.65 + 2.3) * 0.85 + 0.55
          : Math.cos(r * 0.7 + 2.1) * 1.6 + 1.3;
        const rightSteps = Math.floor(rightWave);
        const rightMinCol = rightSteps >= 0 ? cols - 1 - rightSteps : cols;

        for (let c = 0; c < cols; c++) {
          const isLeftEdge = leftMaxCol >= 0 && c <= leftMaxCol;
          const isRightEdge = rightMinCol < cols && c >= rightMinCol;
          const isEdge = isLeftEdge || isRightEdge;

          let shouldSpawn = false;
          let isDark = false;
          let shade;
          let opacityMultiplier = 1.0;

          if (isEdge) {
            // Edge mosaic: stepped columns along left/right borders
            shouldSpawn = !isMobile || Math.random() > 0.12;
            const distFromEdge = isLeftEdge ? c : (cols - 1 - c);
            if (distFromEdge === 0) {
              isDark = Math.random() > 0.35;
            } else {
              isDark = Math.random() > 0.55;
            }
            shade = isDark
              ? DARK_SHADES[Math.floor(Math.random() * DARK_SHADES.length)]
              : LIGHT_SHADES[Math.floor(Math.random() * LIGHT_SHADES.length)];
          } else if (isMobile) {
            // MOBILE:
            // Hero text is roughly rows 4 to 20, center columns
            const isTextZone = r >= 4 && r <= 20 && c >= 1 && c <= cols - 2;
            const isBottomArea = r > 20;

            if (isBottomArea) {
              // Bottom non-text area on mobile:
              // Tasteful organic clusters (balanced, ~22% fill, NOT a dense wall)
              const bottomNoise = Math.sin(c * 0.85 + r * 1.05) * Math.cos(r * 0.55 - c * 0.5);
              if (bottomNoise > 0.35 && Math.random() > 0.32) {
                shouldSpawn = true;
                isDark = Math.random() > 0.50;
                shade = isDark
                  ? DARK_SHADES[Math.floor(Math.random() * DARK_SHADES.length)]
                  : LIGHT_SHADES[Math.floor(Math.random() * LIGHT_SHADES.length)];
                opacityMultiplier = 0.85;
              }
            } else if (!isTextZone) {
              // Outer upper areas on mobile
              if (Math.random() < 0.18) {
                shouldSpawn = true;
                isDark = Math.random() > 0.60;
                shade = isDark
                  ? DARK_SHADES[Math.floor(Math.random() * DARK_SHADES.length)]
                  : LIGHT_SHADES[Math.floor(Math.random() * LIGHT_SHADES.length)];
                opacityMultiplier = 0.60;
              }
            } else {
              // Inside text zone: very sparse, very light so text has 100% clarity
              const centerNoise = Math.sin(c * 0.95 + r * 1.3) * Math.cos(r * 0.6 - c * 0.4);
              if (centerNoise > 0.68 && Math.random() > 0.70) {
                shouldSpawn = true;
                isDark = false;
                shade = LIGHT_SHADES[Math.floor(Math.random() * LIGHT_SHADES.length)];
                opacityMultiplier = 0.25;
              }
            }
          } else {
            // DESKTOP:
            // Scattered floating tiles across the background, avoiding dense clusters
            const centerNoise = Math.sin(c * 0.9 + r * 1.3) * Math.cos(r * 0.6 - c * 0.4);
            if (centerNoise > 0.52 && Math.random() > 0.48) {
              shouldSpawn = true;
              isDark = Math.random() > 0.60;
              shade = isDark
                ? DARK_SHADES[Math.floor(Math.random() * DARK_SHADES.length)]
                : LIGHT_SHADES[Math.floor(Math.random() * LIGHT_SHADES.length)];
              opacityMultiplier = 0.60;
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
              pulseSpeed: 1.2 + Math.random() * 1.8,
              pulseDepth: 0.20 + Math.random() * 0.25,
              phase: c * 0.4 + r * 0.6 + Math.random() * Math.PI,
              shimmerSpeed: 0.8 + Math.random() * 1.4,
              shimmerPhase: Math.random() * Math.PI * 2,
              scalePulseSpeed: 1.0 + Math.random() * 1.5,
              entranceDelay,
              growDuration: 0.7 + Math.random() * 0.4,
              isDark,
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
      time += 0.018; // Smooth continuous clock

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

        // Periodic shimmer / highlight wave that sweeps gently through tiles
        const shimmer = Math.pow(Math.max(0, Math.sin(time * cell.shimmerSpeed + cell.shimmerPhase)), 3) * 0.20;

        // Mouse or touch hover glow
        const centerX = cell.x + cell.w / 2;
        const centerY = cell.y + cell.h / 2;
        const dx = mouse.x - centerX;
        const dy = mouse.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let hoverGlow = 0;
        if (dist < 140) {
          hoverGlow = (1 - dist / 140) * 0.35;
        }

        // Final calculated opacity
        const alpha = Math.min(1.0, (cell.baseAlpha * pulse * easeOut) + shimmer + hoverGlow);

        // Subtle micro-scale tile breathing (±2%) so the grid feels alive and refined
        const breathingFactor = 1.0 + 0.02 * Math.sin(time * cell.scalePulseSpeed + cell.phase);
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
