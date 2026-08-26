import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { logSearch } from '../context/api';

const TickerWrap = styled.div`
  background: #0a0a0a;
  color: #fafaf8;
  overflow: hidden;
  white-space: nowrap;
  height: 32px;
  display: flex;
  align-items: center;
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
`;

const TickerTrack = styled.div`
  display: flex;
  animation: ticker 22s linear infinite;
  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

const TickerItem = styled.span`
  padding: 0 2rem;
  flex-shrink: 0;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fafaf8;
  border-bottom: 1px solid #e2e0d8;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 1.5rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (min-width: 768px) {
    height: 64px;
    padding: 0 2rem;
  }
`;

const Logo = styled(Link)`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: #0a0a0a;
  text-decoration: none;
`;

const DesktopNav = styled.div`
  display: none;
  align-items: center;
  gap: 2rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavItem = styled.div`
  position: relative;
`;

const NavLink = styled.span`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: color 0.15s;
  &:hover { color: #9a9890; }
`;

const MegaMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fafaf8;
  border: 1px solid #e2e0d8;
  padding: 2rem;
  min-width: 500px;
  display: ${p => p.$open ? 'grid' : 'none'};
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  z-index: 100;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
`;

const MegaSection = styled.div``;

const MegaTitle = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #9a9890;
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const MegaLink = styled(Link)`
  display: block;
  font-size: 14px;
  padding: 0.25rem 0;
  color: #0a0a0a;
  text-decoration: none;
  transition: padding-left 0.15s, color 0.15s;
  &:hover { padding-left: 0.25rem; color: #9a9890; }
  ${p => p.$red && `color: #ef4444; &:hover { color: #dc2626; }`}
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchWrap = styled.div`
  display: ${p => p.$open ? 'flex' : 'none'};
  align-items: center;
  border: 1px solid #e2e0d8;
  background: #fafaf8;
  height: 40px;
  padding: 0 0.75rem;
  gap: 0.5rem;

  @media (min-width: 768px) {
    display: flex;
    width: 220px;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  width: 100%;
  font-family: 'Jost', sans-serif;
`;

const IconBtn = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0a0a;
  position: relative;
`;

const CartBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 0;
  background: #0a0a0a;
  color: #fafaf8;
  font-size: 9px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileMenu = styled.div`
  display: ${p => p.$open ? 'flex' : 'none'};
  flex-direction: column;
  position: fixed;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fafaf8;
  z-index: 40;
  padding: 1rem 1.5rem;
  overflow-y: auto;
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileLink = styled(Link)`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  padding: 0.875rem 0;
  border-bottom: 1px solid #e2e0d8;
  display: block;
`;

const SubLink = styled(Link)`
  font-size: 13px;
  padding: 0.5rem 0 0.5rem 1rem;
  color: #9a9890;
  display: block;
  text-decoration: none;
  &:hover { color: #0a0a0a; }
`;

const navData = {
  Men: {
    Shop: ['Clothing', 'Shoes', 'Mens Sport', 'Accessories', 'Mens Jewellery', 'Grooming'],
    More: ['Featured Brands']
  },
  Women: {
    Fashion: ['New In', 'Clothing', 'Shoes', 'Accessories', 'Jewellery', 'Womens Sport'],
    Beauty: ['Fragrance', 'Haircare', 'Makeup', 'Skincare', 'Tools & Brushes'],
    More: ['Featured Brands']
  },
  Kids: {
    'Shop by Age': ['Baby', 'Girls', 'Boys'],
    'Shop by Type': ['Shoes', 'Clothing', 'Accessories', 'School', 'Sport', 'Toys & Games'],
    More: ['Featured Brands']
  },
  'New In': null,
  Accessories: {
    '': ['Bags', 'Belts', 'Hats', 'Sunglasses', 'Wallets']
  }
};

const tickers = [
  'Free delivery on orders over USD 50',
  'New collection just arrived',
  'Pay with EcoCash, Innbucks, Visa',
  'WhatsApp us for styling advice'
];

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const megaRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(null);
  }, [location]);

  useEffect(() => {
    const handler = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setMegaOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      logSearch(searchQuery.trim());
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      <TickerWrap>
        <TickerTrack>
          {[...tickers, ...tickers].map((t, i) => (
            <TickerItem key={i}>{t}</TickerItem>
          ))}
        </TickerTrack>
      </TickerWrap>

      <Header>
        <Nav>
          <Logo to="/">FOUND</Logo>

          <DesktopNav ref={megaRef}>
            {Object.entries(navData).map(([label, subs]) => (
              <NavItem
                key={label}
                onMouseEnter={() => subs && setMegaOpen(label)}
                onMouseLeave={() => subs && setMegaOpen(null)}
              >
                <NavLink as={Link} to={`/shop?cat=${label}`}>{label}</NavLink>
                {subs && (
                  <MegaMenu $open={megaOpen === label}>
                    {Object.entries(subs).map(([section, items]) => (
                      <MegaSection key={section}>
                        {section && <MegaTitle>{section}</MegaTitle>}
                        {items.map(item => (
                          <MegaLink
                            key={item}
                            to={`/shop?cat=${label}&sub=${item}`}
                            $red={item === 'Sale'}
                          >
                            {item}
                          </MegaLink>
                        ))}
                      </MegaSection>
                    ))}
                  </MegaMenu>
                )}
              </NavItem>
            ))}
          </DesktopNav>

          <RightActions>
            <SearchWrap $open={searchOpen}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%' }}>
                <SearchInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </form>
            </SearchWrap>

            <IconBtn onClick={() => setSearchOpen(!searchOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </IconBtn>

            <IconBtn as={Link} to="/cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && <CartBadge>{count}</CartBadge>}
            </IconBtn>

            <IconBtn onClick={() => setMobileOpen(!mobileOpen)} className="mobile-only">
              {mobileOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </IconBtn>
          </RightActions>
        </Nav>

        <MobileMenu $open={mobileOpen}>
          <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', border: '1px solid #e2e0d8', height: '48px', padding: '0 1rem' }}>
              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontFamily: "'Jost', sans-serif", fontSize: '14px' }}
              />
            </div>
          </form>
          {Object.entries(navData).map(([label, subs]) => (
            <React.Fragment key={label}>
              <MobileLink to={`/shop?cat=${label}`} onClick={() => setMobileOpen(false)}>
                {label}
              </MobileLink>
              {subs && Object.entries(subs).map(([section, items]) =>
                items.map(item => (
                  <SubLink
                    key={item}
                    to={`/shop?cat=${label}&sub=${item}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item}
                  </SubLink>
                ))
              )}
            </React.Fragment>
          ))}
        </MobileMenu>
      </Header>

      <style>{`
        .mobile-only { display: flex; }
        @media (min-width: 768px) { .mobile-only { display: none; } }
      `}</style>
    </>
  );
};

export default Navbar;
