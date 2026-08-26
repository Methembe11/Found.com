import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../context/api';

const PageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 220px 1fr;
    padding: 2rem;
    gap: 2rem;
  }
`;

const Sidebar = styled.aside`
  display: ${p => p.$open ? 'block' : 'none'};

  @media (min-width: 768px) {
    display: block;
  }
`;

const FilterTitle = styled.h3`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #9a9890;
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const FilterItem = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  font-size: 13px;
  padding: 0.375rem 0;
  color: ${p => p.$active ? '#0a0a0a' : '#9a9890'};
  font-weight: ${p => p.$active ? '500' : '300'};
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  &:hover { color: #0a0a0a; }
`;

const SortSelect = styled.select`
  width: 100%;
  height: 48px;
  border: 1px solid #e2e0d8;
  background: #fafaf8;
  padding: 0 1rem;
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  outline: none;
  accent-color: #0a0a0a;
`;

const PriceRange = styled.div`
  margin-top: 1rem;
`;

const RangeInput = styled.input`
  width: 100%;
  accent-color: #0a0a0a;
`;

const PriceLabel = styled.div`
  font-size: 12px;
  color: #9a9890;
  margin-top: 0.25rem;
`;

const FilterBtns = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ApplyBtn = styled.button`
  flex: 1;
  height: 44px;
  background: #0a0a0a;
  color: #fafaf8;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-family: 'Jost', sans-serif;
  border: none;
  cursor: pointer;
`;

const ClearBtn = styled.button`
  flex: 1;
  height: 44px;
  border: 1px solid #e2e0d8;
  background: transparent;
  color: #0a0a0a;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-family: 'Jost', sans-serif;
  cursor: pointer;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const EmptyMsg = styled.p`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 0;
  color: #9a9890;
  font-size: 14px;
`;

const MobileFilterBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 48px;
  border: 1px solid #e2e0d8;
  background: #fafaf8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-family: 'Jost', sans-serif;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const departments = ['All', 'Men', 'Women', 'Kids', 'New In', 'Accessories'];

const subcategoriesByDept = {
  Men: ['Clothing', 'Shoes', 'Mens Sport', 'Accessories', 'Mens Jewellery', 'Grooming'],
  Women: ['New In', 'Clothing', 'Shoes', 'Accessories', 'Jewellery', 'Womens Sport'],
  Kids: ['Baby', 'Girls', 'Boys', 'Shoes', 'Clothing', 'Accessories', 'School', 'Sport', 'Toys & Games'],
  Accessories: ['Bags', 'Belts', 'Hats', 'Sunglasses', 'Wallets'],
  'New In': ['Discover']
};

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);

  const dept = searchParams.get('cat') || 'All';
  const sub = searchParams.get('sub') || '';
  const sort = searchParams.get('sort') || 'default';
  const search = searchParams.get('search') || '';
  const priceMax = searchParams.get('price_max') || '500';

  const [localPriceMax, setLocalPriceMax] = useState(priceMax);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (dept !== 'All') params.category = dept;
      if (sub) params.subcategory = sub;
      if (search) params.search = search;
      if (sort !== 'default') params.sort = sort;
      if (priceMax !== '500') params.price_max = priceMax;
      const data = await fetchProducts(params);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dept, sub, sort, search, priceMax]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const handleDept = (d) => {
    updateParam('cat', d === 'All' ? '' : d);
    updateParam('sub', '');
  };

  const handleSub = (s) => {
    updateParam('sub', s === sub ? '' : s);
  };

  const handleApply = () => {
    updateParam('price_max', localPriceMax === '500' ? '' : localPriceMax);
    setMobileFilters(false);
  };

  const handleClear = () => {
    setSearchParams({});
    setLocalPriceMax('500');
  };

  return (
    <PageWrap>
      <div>
        <MobileFilterBtn onClick={() => setMobileFilters(!mobileFilters)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="8" y2="18"/>
          </svg>
          Filters
        </MobileFilterBtn>

        <Sidebar $open={mobileFilters}>
          <FilterTitle>Department</FilterTitle>
          {departments.map(d => (
            <FilterItem key={d} $active={dept === d || (d === 'All' && dept === 'All')} onClick={() => handleDept(d)}>
              {d}
            </FilterItem>
          ))}

          {subcategoriesByDept[dept] && (
            <>
              <FilterTitle style={{ marginTop: '1.5rem' }}>Subcategory</FilterTitle>
              {subcategoriesByDept[dept].map(s => (
                <FilterItem key={s} $active={sub === s} onClick={() => handleSub(s)}>
                  {s}
                </FilterItem>
              ))}
            </>
          )}

          <FilterTitle style={{ marginTop: '1.5rem' }}>Sort</FilterTitle>
          <SortSelect value={sort} onChange={e => updateParam('sort', e.target.value === 'default' ? '' : e.target.value)}>
            <option value="default">Default</option>
            <option value="price_asc">Price low-high</option>
            <option value="price_desc">Price high-low</option>
            <option value="newest">Newest</option>
          </SortSelect>

          <PriceRange>
            <FilterTitle>Price</FilterTitle>
            <RangeInput
              type="range"
              min="10"
              max="500"
              value={localPriceMax}
              onChange={e => setLocalPriceMax(e.target.value)}
            />
            <PriceLabel>Up to USD {localPriceMax}</PriceLabel>
          </PriceRange>

          <FilterBtns>
            <ApplyBtn onClick={handleApply}>Apply</ApplyBtn>
            <ClearBtn onClick={handleClear}>Clear</ClearBtn>
          </FilterBtns>
        </Sidebar>
      </div>

      <div>
        {loading ? (
          <ProductGrid>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: '#f0efe9', aspectRatio: '3/4', animation: 'pulse 2s infinite' }} />
            ))}
          </ProductGrid>
        ) : products.length === 0 ? (
          <EmptyMsg>No products found in this category</EmptyMsg>
        ) : (
          <ProductGrid>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </ProductGrid>
        )}
      </div>
    </PageWrap>
  );
};

export default ShopPage;
