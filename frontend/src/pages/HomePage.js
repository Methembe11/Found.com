import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../context/api';

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  min-height: 420px;
  border-bottom: 1px solid #e2e0d8;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const HeroLeft = styled.div`
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 3rem;

  @media (min-width: 768px) {
    padding: 3rem;
  }
`;

const HeroGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom right, #1a1a1a, #0a0a0a);
`;

const HeroGridOverlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 40px, #fff 40px, #fff 41px),
    repeating-linear-gradient(90deg, transparent, transparent 40px, #fff 40px, #fff 41px);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
`;

const HeroLabel = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: rgba(250, 250, 248, 0.4);
  margin-bottom: 1rem;
`;

const HeroH1 = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 3rem;
  font-weight: 300;
  color: #fafaf8;
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 3.75rem;
  }

  em {
    font-style: italic;
  }
`;

const HeroBtn = styled(Link)`
  display: inline-block;
  border: 1px solid rgba(250, 250, 248, 0.4);
  color: #fafaf8;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  padding: 0.75rem 1.75rem;
  text-decoration: none;
  transition: all 0.15s;

  &:hover {
    background: #fafaf8;
    color: #0a0a0a;
  }
`;

const HeroRight = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: #e2e0d8;
`;

const HeroTile = styled(Link)`
  position: relative;
  background: #f0efe9;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-decoration: none;
  color: #0a0a0a;
  overflow: hidden;
  min-height: 200px;
`;

const HeroTileImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${HeroTile}:hover & {
    transform: scale(1.05);
  }
`;

const HeroTileOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10,10,10,0.6), rgba(10,10,10,0.1) 50%, transparent);
`;

const HeroTileContent = styled.div`
  position: relative;
  z-index: 10;
  padding: 1.25rem;
`;

const HeroTileName = styled.div`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.025em;
  margin-bottom: 0.125rem;
  color: #fafaf8;
`;

const HeroTileSub = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: rgba(250, 250, 248, 0.7);
`;

const HeroTilePlaceholder = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 80px;
  color: rgba(226, 224, 216, 0.6);
  font-weight: 300;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Section = styled.section`
  padding: 2.5rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.5rem, 5vw, 1.875rem);
  font-weight: 300;
  letter-spacing: -0.025em;

  em { font-style: italic; }
`;

const ViewAll = styled(Link)`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #9a9890;
  text-decoration: none;
  transition: color 0.15s;
  &:hover { color: #0a0a0a; }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const PaymentBanner = styled.section`
  background: #0a0a0a;
  padding: 3rem 1.5rem;
  text-align: center;

  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }
`;

const PaymentTitle = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.5rem, 5vw, 1.875rem);
  font-weight: 300;
  font-style: italic;
  color: #fafaf8;
  margin-bottom: 0.75rem;
`;

const PaymentMethods = styled.p`
  font-size: 12px;
  letter-spacing: 0.15em;
  color: rgba(250, 250, 248, 0.5);
  margin-bottom: 1.5rem;
`;

const PaymentBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  min-width: 200px;
  border: 1px solid #fafaf8;
  background: transparent;
  color: #fafaf8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  text-decoration: none;
  transition: all 0.15s;

  &:hover {
    background: #fafaf8;
    color: #0a0a0a;
  }
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Skeleton = styled.div`
  background: #f0efe9;
  aspect-ratio: 3/4;
  animation: pulse 2s infinite;

  @keyframes pulse {
    50% { opacity: 0.5; }
  }
`;

const categories = [
  { name: 'Men', sub: 'Tailored essentials' },
  { name: 'Women', sub: 'Contemporary pieces' },
  { name: 'Accessories', sub: 'The finishing touch' },
  { name: 'New In', sub: 'Just arrived' }
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [catImages, setCatImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [feat, newest] = await Promise.all([
          fetchProducts({ limit: 8 }),
          fetchProducts({ sort: 'newest', limit: 8 })
        ]);
        setFeatured(feat);
        setNewArrivals(newest.slice(4));

        const imgs = {};
        await Promise.all(
          categories.map(async cat => {
            try {
              const res = await fetchProducts({ category: cat.name, limit: 1 });
              if (res[0] && res[0].image_url) {
                imgs[cat.name] = res[0].image_url;
              }
            } catch (e) { /* ignore */ }
          })
        );
        setCatImages(imgs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <HeroGrid>
        <HeroLeft>
          <HeroGradient />
          <HeroGridOverlay />
          <HeroContent>
            <HeroLabel>New Collection &mdash; 2025</HeroLabel>
            <HeroH1>Dressed<br/>for the<br/><em>city.</em></HeroH1>
            <HeroBtn to="/shop">Shop the look</HeroBtn>
          </HeroContent>
        </HeroLeft>

        <HeroRight>
          {categories.map(cat => (
            <HeroTile key={cat.name} to={`/shop?cat=${cat.name}`}>
              {catImages[cat.name] ? (
                <HeroTileImg src={catImages[cat.name]} alt={cat.name} />
              ) : (
                <HeroTilePlaceholder>F</HeroTilePlaceholder>
              )}
              <HeroTileOverlay />
              <HeroTileContent>
                <HeroTileName>{cat.name}</HeroTileName>
                <HeroTileSub>{cat.sub}</HeroTileSub>
              </HeroTileContent>
            </HeroTile>
          ))}
        </HeroRight>
      </HeroGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>Featured <em>this week</em></SectionTitle>
          <ViewAll to="/shop">View all</ViewAll>
        </SectionHeader>
        {loading ? (
          <LoadingGrid>
            {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
          </LoadingGrid>
        ) : (
          <ProductGrid>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </ProductGrid>
        )}
      </Section>

      <PaymentBanner>
        <PaymentTitle>Pay your way.</PaymentTitle>
        <PaymentMethods>EcoCash &mdash; Innbucks &mdash; ZimSwitch &mdash; Omari &mdash; Visa &mdash; Mastercard</PaymentMethods>
        <PaymentBtn to="/shop">Shop now</PaymentBtn>
      </PaymentBanner>

      {newArrivals.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>New <em>arrivals</em></SectionTitle>
            <ViewAll to="/shop?sort=newest">View all</ViewAll>
          </SectionHeader>
          <ProductGrid>
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </ProductGrid>
        </Section>
      )}
    </div>
  );
};

export default HomePage;
