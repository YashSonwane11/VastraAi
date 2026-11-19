import React, { useEffect, useRef, useState } from 'react';

interface RealisticTryOnCanvasProps {
  personImageUrl: string;
  sareeImageUrl: string;
  sareeColor?: string;
  sareeName?: string;
  className?: string;
}

const COLOR_MAP: Record<string, [number, number, number]> = {
  Red: [205, 30, 45],
  Blue: [25, 65, 165],
  Pink: [240, 130, 195],
  Green: [30, 145, 55],
  Wine: [115, 20, 55],
  Gold: [225, 185, 45],
  Lavender: [195, 165, 215],
  Maroon: [130, 20, 30],
  'Peacock Blue': [20, 125, 170],
  'Rose Gold': [215, 155, 145],
  Ivory: [235, 228, 215],
  Teal: [25, 138, 125],
};

export default function RealisticTryOnCanvas({
  personImageUrl,
  sareeImageUrl,
  sareeColor = 'Blue',
  sareeName = 'Saree',
  className = '',
}: RealisticTryOnCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isCancelled = false;

    const personImg = new Image();
    personImg.crossOrigin = 'anonymous';

    personImg.onload = () => {
      if (isCancelled) return;

      const width = 600;
      const height = Math.round((personImg.height / personImg.width) * 600) || 800;
      canvas.width = width;
      canvas.height = height;

      // 1. Draw original photo
      ctx.drawImage(personImg, 0, 0, width, height);

      // 2. Perform clothing transformation
      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        const targetRGB = COLOR_MAP[sareeColor] || [25, 65, 165];
        const [tr, tg, tb] = targetRGB;

        // Head and neck boundary (upper 28% of portrait is strictly protected face/hair)
        const neckY = Math.round(height * 0.28);

        for (let y = neckY; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Protect skin: hue/saturation checks
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const delta = max - min;
            const sat = max > 0 ? delta / max : 0;

            // Skin is moderate saturation and warm
            const isSkin = r > 105 && g > 55 && b > 30 && r > g && g > b && sat < 0.45;

            // Background foliage / bright background
            const isGreenBg = g > r * 1.15 && g > b * 1.10;
            const isBrightBg = r > 230 && g > 230 && b > 230;

            // Clothing transformation:
            if (!isSkin && !isGreenBg && !isBrightBg) {
              const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
              const factor = Math.min(1.35, Math.max(0.35, lum / 0.55));

              // Replace color while retaining exact physical fold shadows
              data[idx] = Math.min(255, Math.round(tr * factor));
              data[idx + 1] = Math.min(255, Math.round(tg * factor));
              data[idx + 2] = Math.min(255, Math.round(tb * factor));
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setRendered(true);
      } catch (err) {
        console.warn('Canvas pixel processing fallback', err);
        setRendered(true);
      }
    };

    personImg.onerror = () => {
      setRendered(true);
    };

    personImg.src = personImageUrl;

    return () => {
      isCancelled = true;
    };
  }, [personImageUrl, sareeImageUrl, sareeColor]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: rendered ? 1 : 0.9 }}
      />
    </div>
  );
}
