import { NextResponse } from 'next/server';
import { kv } from '@onreza/runtime/kv';

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Oversized Tee', price: 6500, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80', description: 'Свободный хлопковый оверсайз-тени', sizes: ['XS','S','M','L','XL'], colors: ['Белый','Чёрный','Серый'], category: 'new' },
  { id: 2, name: 'Wide Leg Trousers', price: 12000, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80', description: 'Широкие брюки свободного кроя', sizes: ['XS','S','M','L'], colors: ['Бежевый','Чёрный'], category: 'new' },
  { id: 3, name: 'Flowy Shirt', price: 8500, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80', description: 'Лёгкая струящаяся рубашка', sizes: ['XS','S','M','L','XL'], colors: ['Белый','Голубой'], category: 'new' },
  { id: 4, name: 'Oversized Jacket', price: 18500, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80', description: 'Удлинённая куртка оверсайз', sizes: ['S','M','L','XL'], colors: ['Чёрный','Хаки'], category: 'catalog' },
];

const DEFAULT_LOOKBOOK = [
  { id: 1, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80', caption: '自由 — Свобода' },
  { id: 2, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', caption: 'Восточный минимализм' },
  { id: 3, image: 'https://images.unsplash.com/photo-1529139574466-a302d2d3f524?w=800&q=80', caption: 'Лёгкость в каждом образе' },
];

const DEFAULT_SETTINGS = { siteTitle: 'ICYOU — Свобода в каждой нити', tagline: 'Свободные силуэты в духе восточноазиатского минимализма', season: 'Весна / Лето 2026' };

async function getData(key: string, defaults: any) {
  try {
    const data = await kv.get(key);
    if (data) return JSON.parse(data as string);
    await kv.set(key, JSON.stringify(defaults));
    return defaults;
  } catch { return defaults; }
}

async function saveData(key: string, data: any) {
  try { await kv.set(key, JSON.stringify(data)); } catch {}
}

export async function GET() {
  const products = await getData('icyou_products', DEFAULT_PRODUCTS);
  const lookbook = await getData('icyou_lookbook', DEFAULT_LOOKBOOK);
  const settings = await getData('icyou_settings', DEFAULT_SETTINGS);
  return NextResponse.json({ products, lookbook, settings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.type === 'product') {
      const products = await getData('icyou_products', DEFAULT_PRODUCTS);
      products.push({ ...body, id: Date.now() });
      await saveData('icyou_products', products);
    } else if (body.type === 'lookbook') {
      const lookbook = await getData('icyou_lookbook', DEFAULT_LOOKBOOK);
      lookbook.push({ ...body, id: Date.now() });
      await saveData('icyou_lookbook', lookbook);
    }
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Error' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    const type = searchParams.get('type');
    if (type === 'product') {
      const products = await getData('icyou_products', DEFAULT_PRODUCTS);
      await saveData('icyou_products', products.filter((p: any) => p.id !== id));
    } else if (type === 'lookbook') {
      const lookbook = await getData('icyou_lookbook', DEFAULT_LOOKBOOK);
      await saveData('icyou_lookbook', lookbook.filter((l: any) => l.id !== id));
    }
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Error' }, { status: 500 }); }
}