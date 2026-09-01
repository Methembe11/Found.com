import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  fetchAdminStats, fetchAdminProducts, fetchAdminOrders,
  fetchAdminCustomers, fetchAdminSearchLogs, createAdminProduct,
  updateAdminProduct, deleteAdminProduct, resolveImageUrl
} from '../context/api';

const Wrap = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  background: #0a0a0a;
  color: #fafaf8;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TopLogo = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 16px;
  letter-spacing: -0.02em;
`;

const SignOut = styled.button`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #9a9890;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Jost', sans-serif;
  &:hover { color: #fafaf8; }
`;

const Body = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  @media (min-width: 768px) {
    grid-template-columns: 200px 1fr;
  }
`;

const Sidebar = styled.div`
  background: #f0efe9;
  padding: 1rem 0;
  display: flex;
  flex-direction: row;
  overflow-x: auto;

  @media (min-width: 768px) {
    flex-direction: column;
    overflow-x: hidden;
    padding: 1.5rem 0;
  }
`;

const SideItem = styled.button`
  padding: 0.625rem 1.5rem;
  font-size: 13px;
  text-align: left;
  background: ${p => p.$active ? '#fafaf8' : 'transparent'};
  border: none;
  border-left: 2px solid ${p => p.$active ? '#0a0a0a' : 'transparent'};
  cursor: pointer;
  font-family: 'Jost', sans-serif;
  white-space: nowrap;
  &:hover { background: rgba(250,250,248,0.5); }

  @media (min-width: 768px) {
    border-left: 2px solid ${p => p.$active ? '#0a0a0a' : 'transparent'};
  }
`;

const Content = styled.div`
  padding: 1.5rem;
  overflow-y: auto;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const ContentTitle = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background: #fafaf8;
  border: 1px solid #e2e0d8;
  padding: 1rem;
`;

const StatLabel = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #9a9890;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
`;

const Table = styled.div`
  overflow-x: auto;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$cols};
  gap: 0.5rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e0d8;
  font-size: 13px;
  align-items: center;
  min-width: ${p => p.$minWidth || 'auto'};
`;

const TableHeader = styled(TableRow)`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #9a9890;
  font-weight: 500;
`;

const ActionBtn = styled.button`
  font-size: 11px;
  padding: 0.25rem 0.5rem;
  border: 1px solid #e2e0d8;
  background: transparent;
  cursor: pointer;
  font-family: 'Jost', sans-serif;
  margin-right: 0.25rem;
  &:hover { border-color: #0a0a0a; }
`;

const DeleteBtn = styled(ActionBtn)`
  color: #ef4444;
  &:hover { border-color: #ef4444; }
`;

const FormCard = styled.div`
  background: #fafaf8;
  border: 1px solid #e2e0d8;
  padding: 1.5rem;
  max-width: 500px;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  margin-bottom: 0.375rem;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  border: 1px solid #e2e0d8;
  background: #fafaf8;
  padding: 0 1rem;
  font-family: 'Jost', sans-serif;
  font-size: 15px;
  outline: none;
`;

const Select = styled.select`
  width: 100%;
  height: 48px;
  border: 1px solid #e2e0d8;
  background: #fafaf8;
  padding: 0 1rem;
  font-family: 'Jost', sans-serif;
  font-size: 15px;
  outline: none;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid #e2e0d8;
  background: #fafaf8;
  padding: 0.75rem 1rem;
  font-family: 'Jost', sans-serif;
  font-size: 15px;
  outline: none;
  resize: none;
`;

const SaveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 2rem;
  background: #0a0a0a;
  color: #fafaf8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-family: 'Jost', sans-serif;
  border: none;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const QuickBtn = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e0d8;
  background: #fafaf8;
  font-size: 12px;
  font-family: 'Jost', sans-serif;
  cursor: pointer;
  &:hover { border-color: #0a0a0a; }
`;

const KeywordRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e0d8;
  font-size: 13px;
`;

const catOptions = {
  Men: ['Clothing', 'Shoes', 'Mens Sport', 'Accessories', 'Mens Jewellery', 'Grooming'],
  Women: ['New In', 'Clothing', 'Shoes', 'Accessories', 'Jewellery', 'Womens Sport'],
  Kids: ['Baby', 'Girls', 'Boys', 'Shoes', 'Clothing', 'Accessories', 'School', 'Sport', 'Toys & Games'],
  Accessories: ['Bags', 'Belts', 'Hats', 'Sunglasses', 'Wallets'],
  'New In': ['Discover']
};

const ImagePreview = styled.div`
  width: 80px;
  height: 100px;
  background: #f0efe9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #e2e0d8;
  margin-bottom: 0.5rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImagePlaceholder = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 24px;
  color: #e2e0d8;
`;

const FileInput = styled.input`
  width: 100%;
  height: 48px;
  border: 1px dashed #e2e0d8;
  background: #fafaf8;
  padding: 0 1rem;
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  outline: none;
  cursor: pointer;

  &::file-selector-button {
    margin-right: 0.75rem;
    padding: 0.375rem 0.75rem;
    border: 1px solid #e2e0d8;
    background: #fafaf8;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    cursor: pointer;
    &:hover { border-color: #0a0a0a; }
  }
`;

const ProductThumb = styled.div`
  width: 40px;
  height: 50px;
  background: #f0efe9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ThumbPlaceholder = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 14px;
  color: #e2e0d8;
`;

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('found_admin_token');
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState({ orders: 0, revenue: 0, customers: 0, products: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [analytics, setAnalytics] = useState({ topKeywords: [], recent: [] });
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Men', subcategory: '', price: '', stock: '', badge: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!token) { navigate('/admin'); return; }
    loadTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const loadTab = async (t) => {
    try {
      if (t === 'dashboard') {
        const s = await fetchAdminStats(token);
        setStats(s);
      } else if (t === 'products') {
        const p = await fetchAdminProducts(token);
        setProducts(p);
      } else if (t === 'orders') {
        const o = await fetchAdminOrders(token);
        setOrders(o);
      } else if (t === 'customers') {
        const c = await fetchAdminCustomers(token);
        setCustomers(c);
      } else if (t === 'analytics') {
        const a = await fetchAdminSearchLogs(token);
        setAnalytics(a);
      }
    } catch (err) {
      if (err.message?.includes('401')) navigate('/admin');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
    if (imageFile) {
      fd.append('image', imageFile);
    } else if (imageUrl) {
      fd.append('image_url', imageUrl);
    }

    try {
      if (editProduct) {
        await updateAdminProduct(token, editProduct.id, fd);
      } else {
        await createAdminProduct(token, fd);
      }
      setForm({ name: '', category: 'Men', subcategory: '', price: '', stock: '', badge: '', description: '' });
      setEditProduct(null);
      setImageFile(null);
      setImageUrl('');
      setImagePreview('');
      loadTab('products');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteAdminProduct(token, id);
    loadTab('products');
  };

  const handleEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, category: p.category, subcategory: p.subcategory, price: String(p.price), stock: String(p.stock), badge: p.badge || '', description: p.description || '' });
    setImageFile(null);
    setImageUrl(p.image_url || '');
    setImagePreview(p.image_url || '');
  };

  const handleLogout = () => {
    localStorage.removeItem('found_admin_token');
    navigate('/admin');
  };

  const renderContent = () => {
    switch (tab) {
      case 'dashboard':
        return (
          <>
            <ContentTitle>Dashboard</ContentTitle>
            <QuickActions>
              <QuickBtn onClick={() => setTab('products')}>View products</QuickBtn>
              <QuickBtn onClick={() => setTab('orders')}>View orders</QuickBtn>
            </QuickActions>
            <StatsGrid>
              <StatCard><StatLabel>Orders</StatLabel><StatValue>{stats.orders}</StatValue></StatCard>
              <StatCard><StatLabel>Revenue</StatLabel><StatValue>${stats.revenue}</StatValue></StatCard>
              <StatCard><StatLabel>Customers</StatLabel><StatValue>{stats.customers}</StatValue></StatCard>
              <StatCard><StatLabel>Products</StatLabel><StatValue>{stats.products}</StatValue></StatCard>
            </StatsGrid>
          </>
        );

      case 'products':
        return (
          <>
            <ContentTitle>Products</ContentTitle>
            <FormCard>
              <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '1rem' }}>
                {editProduct ? 'Edit product' : 'Add product'}
              </h3>
              <form onSubmit={handleSaveProduct}>
                <FormGroup>
                  <Label>Product name *</Label>
                  <Input placeholder="e.g. Slim Dress Shirt" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </FormGroup>
                <FormGroup>
                  <Label>Category *</Label>
                  <Select value={form.category} onChange={e => setForm({...form, category: e.target.value, subcategory: ''})}>
                    {Object.keys(catOptions).map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Subcategory</Label>
                  <Select value={form.subcategory} onChange={e => setForm({...form, subcategory: e.target.value})}>
                    <option value="">None</option>
                    {(catOptions[form.category] || []).map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Price (USD) *</Label>
                  <Input type="number" step="0.01" placeholder="0.00" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                </FormGroup>
                <FormGroup>
                  <Label>Stock quantity</Label>
                  <Input type="number" placeholder="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Badge</Label>
                  <Input placeholder="New, Bestseller, Sale..." value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Description</Label>
                  <Textarea placeholder="Product description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Product image</Label>
                  {imagePreview && (
                    <ImagePreview>
                      <img src={imagePreview} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                    </ImagePreview>
                  )}
                  <FileInput
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        setImageUrl('');
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#9a9890', marginTop: '0.375rem' }}>Or paste an image URL:</div>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageFile(null);
                      setImagePreview(e.target.value);
                    }}
                    style={{ marginTop: '0.375rem' }}
                  />
                </FormGroup>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <SaveBtn type="submit">{editProduct ? 'Update' : 'Add product'}</SaveBtn>
                  {editProduct && <QuickBtn type="button" onClick={() => { setEditProduct(null); setForm({ name: '', category: 'Men', subcategory: '', price: '', stock: '', badge: '', description: '' }); setImageFile(null); setImageUrl(''); setImagePreview(''); }}>Cancel</QuickBtn>}
                </div>
              </form>
            </FormCard>

            <Table>
              <TableHeader $cols="40px 50px 1.5fr 1fr 80px 60px 100px" $minWidth="650px">
                <span>#</span><span></span><span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Actions</span>
              </TableHeader>
              {products.map((p, i) => (
                <TableRow key={p.id} $cols="40px 50px 1.5fr 1fr 80px 60px 100px" $minWidth="650px">
                  <span>{i + 1}</span>
                  <ProductThumb>
                    {p.image_url ? <img src={resolveImageUrl(p.image_url)} alt={p.name} /> : <ThumbPlaceholder>F</ThumbPlaceholder>}
                  </ProductThumb>
                  <span>{p.name}</span>
                  <span>{p.category} / {p.subcategory}</span>
                  <span>${p.price}</span>
                  <span>{p.stock}</span>
                  <span>
                    <ActionBtn onClick={() => handleEdit(p)}>Edit</ActionBtn>
                    <DeleteBtn onClick={() => handleDelete(p.id)}>Delete</DeleteBtn>
                  </span>
                </TableRow>
              ))}
            </Table>
          </>
        );

      case 'orders':
        return (
          <>
            <ContentTitle>Orders</ContentTitle>
            <Table>
              <TableHeader $cols="60px 1fr 100px 80px 80px 80px 100px" $minWidth="600px">
                <span>#</span><span>Customer</span><span>Phone</span><span>Total</span><span>Payment</span><span>Status</span><span>Date</span>
              </TableHeader>
              {orders.length === 0 ? (
                <p style={{ padding: '2rem 0', color: '#9a9890', fontSize: '13px' }}>No orders yet</p>
              ) : orders.map((o, i) => (
                <TableRow key={o.id} $cols="60px 1fr 100px 80px 80px 80px 100px" $minWidth="600px">
                  <span>{i + 1}</span>
                  <span>{o.guest?.name}</span>
                  <span>{o.guest?.phone}</span>
                  <span>${o.total?.toFixed(2)}</span>
                  <span>{o.payment_method}</span>
                  <span>{o.status}</span>
                  <span>{new Date(o.created_at).toLocaleDateString()}</span>
                </TableRow>
              ))}
            </Table>
          </>
        );

      case 'customers':
        return (
          <>
            <ContentTitle>Customers</ContentTitle>
            <Table>
              <TableHeader $cols="1.2fr 100px 1fr 60px 80px 80px" $minWidth="550px">
                <span>Name</span><span>Phone</span><span>Email</span><span>Orders</span><span>Total spent</span><span>Since</span>
              </TableHeader>
              {customers.map(c => (
                <TableRow key={c.id} $cols="1.2fr 100px 1fr 60px 80px 80px" $minWidth="550px">
                  <span>{c.name}</span>
                  <span>{c.phone}</span>
                  <span>{c.email || '-'}</span>
                  <span>{c.orders}</span>
                  <span>${c.total_spent}</span>
                  <span>{c.since}</span>
                </TableRow>
              ))}
            </Table>
          </>
        );

      case 'analytics':
        return (
          <>
            <ContentTitle>Search analytics</ContentTitle>
            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#9a9890', marginBottom: '1rem' }}>Top keywords</h3>
            {analytics.topKeywords.length === 0 ? (
              <p style={{ color: '#9a9890', fontSize: '13px' }}>No search data yet</p>
            ) : analytics.topKeywords.map((k, i) => (
              <KeywordRow key={i}>
                <span>{k.keyword}</span>
                <span style={{ color: '#9a9890' }}>{k.count} searches</span>
              </KeywordRow>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Wrap>
      <TopBar>
        <TopLogo>FOUND ADMIN</TopLogo>
        <SignOut onClick={handleLogout}>Sign out</SignOut>
      </TopBar>
      <Body>
        <Sidebar>
          {['dashboard', 'products', 'orders', 'customers', 'analytics'].map(t => (
            <SideItem key={t} $active={tab === t} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </SideItem>
          ))}
        </Sidebar>
        <Content>{renderContent()}</Content>
      </Body>
    </Wrap>
  );
};

export default AdminDashboardPage;
