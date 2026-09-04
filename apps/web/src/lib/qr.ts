import QRCode from 'qrcode';
import { appConfig } from '@/lib/config';

export async function buildQrSvg(shortCode: string, restaurantName: string): Promise<string> {
  const url = `${appConfig.url}/q/${shortCode}`;
  const matrix = await QRCode.toString(url, {
    type: 'svg',
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#091014', light: '#ffffff' },
  });

  // Embrulha com área segura e identificação do restaurante.
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="420" viewBox="0 0 360 420">
  <rect width="360" height="420" fill="#ffffff"/>
  <rect x="16" y="16" width="328" height="328" rx="16" fill="#f4f7f6"/>
  <g transform="translate(48 48) scale(0.72)">
    ${matrix.replace(/<\?xml[^>]*>/, '').replace('<svg', '<svg x="0" y="0"')}
  </g>
  <text x="180" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#091014">${escapeXml(restaurantName)}</text>
  <text x="180" y="396" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#68777d">Aponte a câmera</text>
</svg>`;
}

export async function buildQrPngDataUrl(shortCode: string): Promise<string> {
  const url = `${appConfig.url}/q/${shortCode}`;
  return QRCode.toDataURL(url, {
    margin: 2,
    width: 512,
    errorCorrectionLevel: 'M',
    color: { dark: '#091014', light: '#ffffff' },
  });
}

export function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(href);
}

export function downloadDataUrl(filename: string, dataUrl: string) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
