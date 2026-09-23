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

    // Palette: Variations of locked #064E3B on #F8E7C9 base
    const SHADES = [
      { r: 6, g: 78, b: 59, baseAlpha: 0.92, label: 'deepSolid' },
      { r: 8, g: 88, b: 67, baseAlpha: 0.78, label: 'deepMid' },
      { r: 12, g: 97, b: 72, baseAlpha: 0.62, label: 'forest' },
      { r: 46, g: 124, b: 100, baseAlpha: 0.44, label: 'sage' },
      { r: 95, g: 166, b: 143, baseAlpha: 0.28, label: 'softMint' },
      { r: 140, g: 194, b: 175, baseAlpha: 0.16, label: 'subtleTint' },
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
      // Smaller boxes on mobile so the full geometric mosaic fits with rich detail
      cellW = isMobile ? 24 : isTablet ? 34 : 44;
      cellH = isMobile ? 20 : isTablet ? 28 : 36;
      cols = Math.ceil(width / cellW) + 1;
      rows = Math.ceil(height / cellH) + 1;

      // Header clear rows: protect logo and hamburger menu from background tiles
      const headerClearRows = isMobile ? 3 : 2;

      // Seeded-like organic uneven distribution
      for (let r = 0; r < rows; r++) {
        // Keep top rows in clean base color (#F8E7C9) so header logo and menu stay prominent
        if (r < headerClearRows) continue;

        // Left-side stepped protrusion:
        // Organic undulating stepped wave on mobile matching desktop's uneven mosaic pattern
        const leftWave = isMobile
          ? Math.sin(r * 0.7 + 1.4) * 1.1 + 0.7
          : Math.sin(r * 0.8 + 1.2) * 1.8 + 1.8;
        const leftMaxCol = isMobile
          ? Math.floor(leftWave)
          : 1 + Math.floor(leftWave);

        // Right-side stepped protrusion:
        // Organic undulating stepped wave on right edge, matching desktop's uneven mosaic pattern
        const rightWave = isMobile
          ? Math.cos(r * 0.65 + 2.3) * 1.1 + 0.7
          : Math.cos(r * 0.7 + 2.1) * 2.2 + 2.0;
        const rightSteps = isMobile
          ? Math.floor(rightWave)
          : 1 + Math.floor(rightWave);
        const rightMinCol = rightSteps >= 0 ? cols - 1 - rightSteps : cols;

        for (let c = 0; c < cols; c++) {
          const isLeftEdge = leftMaxCol >= 0 && c <= leftMaxCol;
          const isRightEdge = rightMinCol < cols && c >= rightMinCol;
          const isEdge = isLeftEdge || isRightEdge;

          // In center, place scattered floating mosaic boxes with gentle probability
          // Center is less dense so text stays super clear
          const centerNoise = Math.sin(c * 0.9 + r * 1.3) * Math.cos(r * 0.6 - c * 0.4);
          const isCenterTile = !isEdge && centerNoise > (isMobile ? 0.48 : 0.42) && Math.random() > 0.35;

          if (isEdge || isCenterTile) {
            let shadeIndex;
            let opacityFactor = 1.0;

            if (isEdge) {
              // Closer to screen edge = deeper, more solid; further inside = lighter
              const distFromBorder = isLeftEdge ? c : (cols - 1 - c);
              if (distFromBorder === 0) {
                shadeIndex = Math.random() > 0.35 ? 0 : 1; // deep solid
              } else if (distFromBorder === 1) {
                shadeIndex = Math.random() > 0.4 ? 1 : 2;
              } else if (distFromBorder === 2) {
                shadeIndex = Math.random() > 0.5 ? 2 : 3;
              } else {
                shadeIndex = Math.random() > 0.4 ? 3 : 4;
              }
            } else {
              // Center floating tiles: very subtle, elegant low opacity
              shadeIndex = Math.random() > 0.5 ? 4 : 5;
              opacityFactor = isMobile ? 0.5 : 0.65;
            }

            const shade = SHADES[shadeIndex];
            
            // Staggered entrance delay based on distance and row
            const entranceDelay = isLeftEdge 
              ? (c * 0.12 + (r % 4) * 0.08)
              : isRightEdge 
                ? ((cols - c) * 0.12 + (r % 4) * 0.08)
                : (0.4 + (c / cols) * 0.8 + (r % 3) * 0.1);

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
              baseAlpha: shade.baseAlpha * opacityFactor,
              pulseSpeed: 1.2 + Math.random() * 1.4,
              phase: c * 0.35 + r * 0.45 + Math.random() * Math.PI,
              entranceDelay,
              growDuration: 0.85 + Math.random() * 0.4,
              isEdge,
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
      time += 0.014;

      ctx.clearRect(0, 0, width, height);

      // Subtle background grid guides in #064E3B at 3% opacity
      ctx.strokeStyle = 'rgba(6, 78, 59, 0.04)';
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

      // Draw each animated uneven mosaic cell
      cells.forEach((cell) => {
        // Staggered entrance calculation
        if (elapsed < cell.entranceDelay) return;
        
        const growElapsed = elapsed - cell.entranceDelay;
        const progress = Math.min(1.0, growElapsed / cell.growDuration);
        // Cubic ease out
        const easeOut = 1.0 - Math.pow(1.0 - progress, 3);

        // Ambient breathing pulse: soft oscillation
        const pulse = 0.82 + 0.18 * Math.sin(time * cell.pulseSpeed + cell.phase);

        // Mouse hover interaction: cells near cursor gently illuminate
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
        const alpha = Math.min(1.0, (cell.baseAlpha * pulse * easeOut) + hoverGlow);

        // Subtle micro-scale on entrance for dynamic stepped pop-in
        const currentW = cell.w * (0.85 + 0.15 * easeOut);
        const currentH = cell.h * (0.85 + 0.15 * easeOut);
        const offsetX = (cell.w - currentW) / 2;
        const offsetY = (cell.h - currentH) / 2;

        ctx.fillStyle = `rgba(${cell.r}, ${cell.g}, ${cell.b}, ${alpha})`;
        
        // Crisp, pure geometric matte box
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
