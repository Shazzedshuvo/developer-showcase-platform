import { useEffect, useRef } from 'react';

/**
 * EarthGlobe — An interactive 3D rotating particle & wireframe globe
 * rendered on high-performance HTML5 Canvas with glowing atmosphere,
 * global agency nodes, connecting arcs, and smooth mouse-tilt parallax.
 */
export default function EarthGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.offsetWidth || 600);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Globe configuration
    const GLOBE_RADIUS = Math.min(width, height) * 0.38;
    const DOTS_COUNT = 320;
    let rotationY = 0;
    let rotationX = 0.25;
    let targetRotationX = 0.25;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Generate surface dots on the sphere using Fibonacci spiral for even distribution
    const dots = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < DOTS_COUNT; i++) {
      const y = 1 - (i / (DOTS_COUNT - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      dots.push({ x, y, z, baseSize: Math.random() * 1.5 + 1 });
    }

    // Key Global Tech Hub Hotspots (Silicon Valley, London, Zurich, Dubai, Tokyo, Sydney, Singapore, Toronto)
    const hotspots = [
      { lat: 37.7749, lon: -122.4194, name: 'San Francisco' },
      { lat: 51.5074, lon: -0.1278, name: 'London' },
      { lat: 47.3769, lon: 8.5417, name: 'Zurich' },
      { lat: 25.2048, lon: 55.2708, name: 'Dubai' },
      { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
      { lat: -33.8688, lon: 151.2093, name: 'Sydney' },
      { lat: 1.3521, lon: 103.8198, name: 'Singapore' },
      { lat: 43.6532, lon: -79.3832, name: 'Toronto' },
    ].map((h) => {
      const latRad = (h.lat * Math.PI) / 180;
      const lonRad = (h.lon * Math.PI) / 180;
      return {
        x: Math.cos(latRad) * Math.cos(lonRad),
        y: Math.sin(latRad),
        z: Math.cos(latRad) * Math.sin(lonRad),
        name: h.name,
        pulse: Math.random() * Math.PI,
      };
    });

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      targetRotationY = x * 0.8;
      targetRotationX = y * 0.4 + 0.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 3D rotation projection helper
    const rotate3D = (x, y, z, rotX, rotY) => {
      // Rotate around X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;

      // Rotate around Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;

      return { x: x2, y: y1, z: z2 };
    };

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const isDark = document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light');

      // Smooth rotation dampening
      rotationY += 0.003 + (targetRotationY - mouseX) * 0.05;
      rotationX += (targetRotationX - rotationX) * 0.05;

      // 1. Draw Outer Atmospheric Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        GLOBE_RADIUS * 0.7,
        centerX,
        centerY,
        GLOBE_RADIUS * 1.35
      );
      if (isDark) {
        glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
        glowGrad.addColorStop(0.5, 'rgba(147, 51, 234, 0.04)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.06)');
        glowGrad.addColorStop(0.6, 'rgba(59, 130, 246, 0.02)');
        glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, GLOBE_RADIUS * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Sphere Silhouette Ring
      ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.22)' : 'rgba(99, 102, 241, 0.18)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, GLOBE_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Draw Latitude & Longitude Rings
      const rings = [-0.6, -0.3, 0, 0.3, 0.6];
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = isDark ? 'rgba(129, 140, 248, 0.12)' : 'rgba(99, 102, 241, 0.09)';

      rings.forEach((latOffset) => {
        ctx.beginPath();
        const latRadius = Math.sqrt(1 - latOffset * latOffset) * GLOBE_RADIUS;
        const latY = latOffset * GLOBE_RADIUS;
        const projectedCenter = rotate3D(0, latY, 0, rotationX, 0);

        ctx.ellipse(
          centerX,
          centerY + projectedCenter.y,
          latRadius,
          latRadius * Math.abs(Math.sin(rotationX)),
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      });

      // 4. Render Surface Dots (Sorted by depth Z)
      const projectedDots = dots.map((dot) => {
        const p = rotate3D(dot.x, dot.y, dot.z, rotationX, rotationY);
        return {
          ...p,
          baseSize: dot.baseSize,
        };
      });

      projectedDots.sort((a, b) => a.z - b.z);

      projectedDots.forEach((p) => {
        // Perspective scale & alpha
        const alpha = Math.max(0.08, (p.z + 1) / 2);
        const radius = p.baseSize * (p.z > 0 ? 1 + p.z * 0.3 : 0.8);
        const screenX = centerX + p.x * GLOBE_RADIUS;
        const screenY = centerY + p.y * GLOBE_RADIUS;

        ctx.fillStyle = isDark
          ? `rgba(165, 180, 252, ${alpha * 0.85})`
          : `rgba(99, 102, 241, ${alpha * 0.75})`;

        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Render Active Global Hub Nodes & Connecting Light Arcs
      const projectedHotspots = hotspots.map((h) => {
        h.pulse += 0.04;
        const p = rotate3D(h.x, h.y, h.z, rotationX, rotationY);
        return {
          ...p,
          name: h.name,
          pulse: h.pulse,
        };
      });

      // Draw connecting bezier light arcs between visible front hotspots
      for (let i = 0; i < projectedHotspots.length; i++) {
        for (let j = i + 1; j < projectedHotspots.length; j++) {
          const h1 = projectedHotspots[i];
          const h2 = projectedHotspots[j];

          // Only draw arc if both are relatively on front hemisphere
          if (h1.z > -0.2 && h2.z > -0.2) {
            const x1 = centerX + h1.x * GLOBE_RADIUS;
            const y1 = centerY + h1.y * GLOBE_RADIUS;
            const x2 = centerX + h2.x * GLOBE_RADIUS;
            const y2 = centerY + h2.y * GLOBE_RADIUS;

            // Compute curved midpoint bulging outward
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 - 25 * Math.sin((frame + i * 20) * 0.02);

            const arcAlpha = Math.min((h1.z + 0.4) * 0.5, (h2.z + 0.4) * 0.5);

            ctx.strokeStyle = isDark
              ? `rgba(236, 72, 153, ${Math.max(0.05, arcAlpha * 0.4)})`
              : `rgba(147, 51, 234, ${Math.max(0.05, arcAlpha * 0.35)})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(midX, midY, x2, y2);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // Draw Pulsing Hotspot Radar Dots
      projectedHotspots.forEach((h) => {
        if (h.z > -0.3) {
          const screenX = centerX + h.x * GLOBE_RADIUS;
          const screenY = centerY + h.y * GLOBE_RADIUS;
          const alpha = (h.z + 1) / 2;
          const pulseRadius = 3 + Math.abs(Math.sin(h.pulse)) * 6;

          // Outer pulsing ring
          ctx.strokeStyle = `rgba(244, 63, 94, ${alpha * 0.6})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(screenX, screenY, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Core bright glowing dot
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(screenX, screenY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-[500px] sm:w-[680px] lg:w-[820px] h-[500px] sm:h-[680px] lg:h-[820px] max-w-none opacity-85 dark:opacity-90 transition-opacity duration-500"
      />
    </div>
  );
}
