"use client";

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabase = createClient('https://vmeeyaipfuguvaumjrsw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtZWV5YWlwZnVndXZhdW1qcnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1ODcyMDYsImV4cCI6MjA5MTE2MzIwNn0.BWnNH34ZzgQzgqs3gyHxYXg5bV7qUkJwiucbFS6OQOI');

interface Product { id: number; name: string; price: number; image: string; description: string; sizes: string; colors: string; category: string; }
interface LookbookItem { id: number; image: string; caption: string; }

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lookbook, setLookbook] = useState<LookbookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '', description: '', sizes: '', colors: '', category: 'new' });
  const [newLookbook, setNewLookbook] = useState({ image: '', caption: '' });
  const [toast, setToast] = useState('');
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data: productsData } = await supabase.from('products').select('*').order('id', { ascending: false });
      const { data: lookbookData } = await supabase.from('lookbook').select('*').order('id', { ascending: false });
      setProducts(productsData || []);
      setLookbook(lookbookData || []);
    } catch {}
    setLoading(false);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleLogin = () => {
    if (adminPassword === 'icyou2026') { setIsAdmin(true); setShowLogin(false); showToast('Добро пожаловать!'); }
    else showToast('Неверный пароль');
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) { showToast('Заполните название и цену'); return; }
    await supabase.from('products').insert([{ name: newProduct.name, price: parseInt(newProduct.price), image: newProduct.image, description: newProduct.description, sizes: newProduct.sizes, colors: newProduct.colors, category: newProduct.category }]);
    await fetchData();
    setNewProduct({ name: '', price: '', image: '', description: '', sizes: '', colors: '', category: 'new' });
    showToast('Товар добавлен!');
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Удалить?')) return;
    await supabase.from('products').delete().eq('id', id);
    await fetchData();
    showToast('Удалено');
  };

  const addLookbookItem = async () => {
    if (!newLookbook.image) { showToast('Добавьте URL изображения'); return; }
    await supabase.from('lookbook').insert([{ image: newLookbook.image, caption: newLookbook.caption }]);
    await fetchData();
    setNewLookbook({ image: '', caption: '' });
    showToast('Добавлено в лукбук!');
  };

  const deleteLookbook = async (id: number) => {
    if (!confirm('Удалить?')) return;
    await supabase.from('lookbook').delete().eq('id', id);
    await fetchData();
    showToast('Удалено');
  };

  if (loading) return <div style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', letterSpacing: '8px' }}>ICYOU</div>;

  if (isAdmin) return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', padding: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', letterSpacing: '4px' }}>ICYOU ADMIN</h1>
        <button onClick={() => setIsAdmin(false)} style={{ background: '#A8B5A0', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer' }}>Выйти</button>
      </header>

      <section style={{ background: '#333', padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Добавить товар</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, 200px)', gap: '16px' }}>
          <input placeholder="URL изображения" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} style={{ background: '#222', border: '1px solid #444', color: '#fff', padding: '12px' }} />
          <input placeholder="Название" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ background: '#222', border: '1px solid #444', color: '#fff', padding: '12px' }} />
          <input placeholder="Цена" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ background: '#222', border: '1px solid #444', color: '#fff', padding: '12px' }} />
          <input placeholder="Описание" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ background: '#222', border: '1px solid #444', color: '#fff', padding: '12px' }} />
          <input placeholder="Размеры (XS, S, M)" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} style={{ background: '#222', border: '1px solid #444', color: '#fff', padding: '12px' }} />
          <input placeholder="Цвета (Белый, Чёрный)" value={newProduct.colors} onChange={e => setNewProduct({...newProduct, colors: e.target.value})} style={{ background: '#222', border: '1px solid #444', color: '#fff', padding: '12px' }} />
          <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={{ background: '#222', border: '1px solid #444', color: '#fff', padding: '12px' }}>
            <option value="new">Новинка</option><option value="catalog">Каталог</option>
          </select>
        </div>
        <button onClick={addProduct} style={{ background: '#A8B5A0', border: 'none', padding: '14px 28px', borderRadius: '6px', cursor: 'pointer', marginTop: '20px' }}>Добавить товар</button>
      </section>

      <section style={{ background: '#333', padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Товары ({products.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products.map(p => (
            <div key={p.id} style={{ background: '#222', padding: '16px', borderRadius: '8px' }}>
              <img src={p.image} alt={p.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} />
              <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>{p.name}</h3>
              <p style={{ color: '#aaa', marginBottom: '10px' }}>{p.price.toLocaleString()} ₽</p>
              <button onClick={() => deleteProduct(p.id)} style={{ background: '#dc3545', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>Удалить</button>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#333', padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Лукбук</h2>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <input placeholder="URL изображения" value={newLookbook.image} onChange={e => setNewLookbook({...newLookbook, image: e.target.value})} style={{ flex: 1, background: '#222', border: '1px solid #444', color: '#fff', padding: '12px' }} />
          <input placeholder="Подпись" value={newLookbook.caption} onChange={e => setNewLookbook({...newLookbook, caption: e.target.value})} style={{ flex: 1, background: '#222', border: '1px solid #444', color: '#fff', padding: '12px' }} />
        </div>
        <button onClick={addLookbookItem} style={{ background: '#A8B5A0', border: 'none', padding: '14px 28px', borderRadius: '6px', cursor: 'pointer' }}>Добавить фото</button>
      </section>

      <section style={{ background: '#333', padding: '30px', borderRadius: '12px' }}>
        <h2 style={{ marginBottom: '20px' }}>Лукбук ({lookbook.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {lookbook.map(l => (
            <div key={l.id} style={{ background: '#222', padding: '16px', borderRadius: '8px' }}>
              <img src={l.image} alt={l.caption} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} />
              <p style={{ fontSize: '14px', marginBottom: '10px' }}>{l.caption}</p>
              <button onClick={() => deleteLookbook(l.id)} style={{ background: '#dc3545', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>Удалить</button>
            </div>
          ))}
        </div>
      </section>

      {toast && <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', background: '#A8B5A0', color: '#000', padding: '16px 32px', borderRadius: '8px' }}>{toast}</div>}
    </div>
  );

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(250,250,250,0.9)', backdropFilter: 'blur(20px)', zIndex: 100, borderBottom: '1px solid #eee' }}>
        <div style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '0.2em' }}>ICYOU</div>
        <div style={{ display: 'flex', gap: '32px' }}>
          <a href="#shop" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }}>Магазин</a>
          <a href="#lookbook" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }}>Лукбук</a>
          <a href="#about" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }}>О нас</a>
        </div>
      </nav>

      <section style={{ padding: '180px 48px 80px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '72px', fontWeight: 600, lineHeight: 1.05, marginBottom: '16px' }}>Носи свою <span style={{ fontFamily: 'Noto Sans JP', fontWeight: 300, color: '#6B6B6B' }}>自由</span></h1>
        <p style={{ fontSize: '18px', color: '#6B6B6B', maxWidth: '400px', margin: '0 auto 48px' }}>Свободные силуэты в духе восточноазиатского минимализма</p>
        <button onClick={() => window.location.hash = '#shop'} style={{ background: '#1a1a1a', color: '#FAFAFA', border: 'none', padding: '16px 32px', fontSize: '14px', letterSpacing: '0.05em', cursor: 'pointer' }}>Смотреть коллекцию</button>
      </section>

      <section id="shop" style={{ padding: '80px 48px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '8px' }}>Новинки</h2>
        <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '48px' }}>Весна / Лето 2026</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {products.filter(p => p.category === 'new').map(p => (
            <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ cursor: 'pointer' }}>
              <div style={{ aspectRatio: '3/4', background: '#F5F3EF', overflow: 'hidden', marginBottom: '16px' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{p.name}</h3>
              <p style={{ fontSize: '14px', color: '#6B6B6B' }}>{p.price.toLocaleString()} ₽</p>
            </div>
          ))}
        </div>
      </section>

      <section id="lookbook" style={{ background: '#1a1a1a', color: '#FAFAFA', padding: '80px 48px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '8px' }}>Лукбук</h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '48px' }}>自由 — Свобода</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {lookbook.map(l => (
            <div key={l.id} style={{ aspectRatio: '1', background: '#F5F3EF', position: 'relative', overflow: 'hidden' }}>
              <img src={l.image} alt={l.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', bottom: '24px', left: '24px', fontSize: '14px', fontWeight: 500 }}>{l.caption}</span>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ background: '#1a1a1a', color: '#FAFAFA', padding: '64px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <div onClick={() => { const c = logoClicks + 1; setLogoClicks(c); if (c >= 5) setShowLogin(true); }} style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '0.2em', marginBottom: '16px', cursor: 'pointer' }}>ICYOU</div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>自由 Свобода в каждой нити</p>
          </div>
          <div style={{ display: 'flex', gap: '64px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Магазин</h4>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textDecoration: 'none' }}>Каталог</a>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textDecoration: 'none' }}>Размеры</a>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>О нас</h4>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textDecoration: 'none' }}>Бренд</a>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textDecoration: 'none' }}>Контакты</a>
            </div>
          </div>
        </div>
      </footer>

      {selectedProduct && (
        <div onClick={() => setSelectedProduct(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#FAFAFA', maxWidth: '900px', width: '90%', maxHeight: '90vh', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
            <div><img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            <div style={{ padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
              <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '16px' }}>{selectedProduct.name}</h2>
              <p style={{ fontSize: '24px', fontWeight: 500, color: '#A8B5A0', marginBottom: '24px' }}>{selectedProduct.price.toLocaleString()} ₽</p>
              <p style={{ fontSize: '16px', color: '#6B6B6B', marginBottom: '24px', lineHeight: 1.7 }}>{selectedProduct.description}</p>
              <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B6B', marginBottom: '8px' }}>Размеры</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {selectedProduct.sizes?.split(',').map(s => <span key={s} style={{ padding: '10px 20px', border: '1px solid #ddd', fontSize: '14px' }}>{s.trim()}</span>)}
              </div>
              <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B6B', marginBottom: '8px' }}>Цвета</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedProduct.colors?.split(',').map(c => <span key={c} style={{ padding: '8px 16px', border: '1px solid #eee', fontSize: '13px' }}>{c.trim()}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '12px', maxWidth: '400px', width: '90%' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>ВХОД</h2>
            <input type="password" placeholder="Пароль" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} style={{ width: '100%', background: '#222', border: '1px solid #444', color: '#fff', padding: '14px', marginBottom: '16px' }} />
            <button onClick={handleLogin} style={{ width: '100%', background: '#A8B5A0', border: 'none', padding: '14px', borderRadius: '6px', cursor: 'pointer' }}>Войти</button>
          </div>
        </div>
      )}
    </div>
  );
}