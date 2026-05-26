/**
 * Branded PNG overlay composer using Sharp.
 *
 * Reads a template PNG + its JSON manifest from public/social-templates/,
 * composites the business photo into the photo box, draws the business
 * name into the name box, and optionally a caption snippet into the
 * caption strip. Returns a PNG buffer suitable for storage upload.
 *
 * Text rendering uses SVG-as-overlay (Sharp's text rendering is opaque on
 * older versions; SVG gives us pixel-perfect placement + custom fonts).
 */

import sharp from 'sharp';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import type { Business } from '@/data/localBusinesses';
import type { OverlayManifest } from './types';

const TEMPLATE_DIR = path.join(process.cwd(), 'public', 'social-templates');

async function loadManifest(templateName: string): Promise<OverlayManifest> {
  const jsonPath = path.join(TEMPLATE_DIR, `${templateName}.json`);
  const raw = await readFile(jsonPath, 'utf-8');
  return JSON.parse(raw) as OverlayManifest;
}

function svgFor(
  text: string,
  box: { x: number; y: number; w: number; h: number; font_px: number; color: string; align?: string },
  canvas: { width: number; height: number },
): Buffer {
  const safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const anchor =
    box.align === 'center' ? 'middle' :
    box.align === 'right' ? 'end' : 'start';
  const xText =
    box.align === 'center' ? box.x + box.w / 2 :
    box.align === 'right' ? box.x + box.w : box.x;
  // y in SVG is baseline of text — drop down by font_px so text sits inside the box
  const yText = box.y + box.font_px;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
    <style>
      .label {
        font-family: 'Fraunces', 'Georgia', serif;
        font-weight: 700;
        font-size: ${box.font_px}px;
        fill: ${box.color};
      }
    </style>
    <text x="${xText}" y="${yText}" class="label" text-anchor="${anchor}">${safe}</text>
  </svg>`;
  return Buffer.from(svg);
}

export async function composeOverlay(
  business: Business,
  basePhotoUrl: string,
  templateName: string,
  captionSnippet?: string,
): Promise<Buffer> {
  const manifest = await loadManifest(templateName);
  const templatePngPath = path.join(TEMPLATE_DIR, `${templateName}.png`);

  // Fetch base photo (Unsplash/Pexels CDN per next.config.ts remotePatterns)
  const photoRes = await fetch(basePhotoUrl);
  if (!photoRes.ok) {
    throw new Error(`overlay: photo fetch failed ${photoRes.status} ${basePhotoUrl}`);
  }
  const photoBuf = Buffer.from(await photoRes.arrayBuffer());

  // Resize photo to manifest.photo box (cover)
  const photoFitted = await sharp(photoBuf)
    .resize(manifest.photo.w, manifest.photo.h, { fit: 'cover', position: 'attention' })
    .png()
    .toBuffer();

  // Start from the template PNG as the canvas
  const composites: sharp.OverlayOptions[] = [
    { input: photoFitted, top: manifest.photo.y, left: manifest.photo.x },
  ];

  // Field-name reality: Business has `id` (slug) + `name`, NO `slug` field.
  const businessName = business.name ?? business.id ?? '';
  if (businessName) {
    composites.push({
      input: svgFor(businessName, manifest.business_name, manifest),
      top: 0,
      left: 0,
    });
  }

  if (manifest.caption_strip && captionSnippet) {
    const snip = captionSnippet.slice(0, manifest.caption_strip.max_chars);
    composites.push({
      input: svgFor(snip, manifest.caption_strip, manifest),
      top: 0,
      left: 0,
    });
  }

  const out = await sharp(templatePngPath)
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toBuffer();

  return out;
}
