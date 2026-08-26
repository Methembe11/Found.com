import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { fetchProduct } from '../context/api';

const PageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Breadcrumb = styled.div`
  font-size: 11px;
  color: #9a9890;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BLink = styled(Link)`
  color: #9a9890;
  text-decoration: none;
  &:hover { color: #0a0a0a; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
`;

const ImageCarousel = styled.div`
  position: relative;
  background: #f0efe9;
  aspect-ratio: 3/4;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Placeholder = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 120px;
  color: #e2e0d8;
  font-weight: 300;
`;

const Dots = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$active ? '#0a0a0a' : '#e2e0d8'};
`;

const Details = styled.div``;

const CollectionLabel = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #9a9890;
  margin-bottom: 0.75rem;
`;

const ProductName = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 300;
  letter-spacing: -0.025em;
  margin-bottom: 0.75rem;
  line-height: 1.2;
`;

const ProductPrice = styled.div`
  font-size: 16px;
  margin-bottom: 1.5rem;
`;

const SizeLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #9a9890;
  margin-bottom: 0.75rem;
`;

const SizeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const SizeBtn = styled.button`
  width: 48px;
  height: 48px;
  border: 1px solid ${p => p.$active ? '#0a0a0a' : '#e2e0d8'};
  background: ${p => p.$active ? '#0a0a0a' : 'transparent'};
  color: ${p => p.$active ? '#fafaf8' : '#0a0a0a'};
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
`;

const AddToCartBtn = styled.button`
  display: flex;
  width: 100%;
  height: 52px;
  align-items: center;
  justify-content: center;
  background: ${p => p.$added ? '#22c55e' : '#0a0a0a'};
  color: #fafaf8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-family: 'Jost', sans-serif;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
  margin-bottom: 0.75rem;

  &:hover { opacity: 0.9; }
`;

const WhatsAppBtn = styled.a`
  display: flex;
  width: 100%;
  height: 52px;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid #e2e0d8;
  background: transparent;
  color: #0a0a0a;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-family: 'Jost', sans-serif;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #25D366;
    border-color: #25D366;
    color: #fff;
  }
`;

const Description = styled.p`
  font-size: 14px;
  color: #9a9890;
  line-height: 1.6;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e0d8;
`;

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <PageWrap>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minHeight: '50vh' }}>
          <div style={{ background: '#f0efe9' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ height: '20px', width: '120px', background: '#f0efe9' }} />
            <div style={{ height: '32px', width: '80%', background: '#f0efe9' }} />
            <div style={{ height: '20px', width: '80px', background: '#f0efe9' }} />
          </div>
        </div>
      </PageWrap>
    );
  }

  if (!product) {
    return <PageWrap><p>Product not found.</p></PageWrap>;
  }

  const whatsappMsg = encodeURIComponent(
    `Hi FOUND, I'm interested in the ${product.name} (USD ${product.price.toFixed(2)}). Could you assist me with sizing and availability?`
  );

  return (
    <PageWrap>
      <Breadcrumb>
        <BLink to="/">Home</BLink> / <BLink to="/shop">Shop</BLink> / {product.name}
      </Breadcrumb>

      <Grid>
        <ImageCarousel>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Placeholder>F</Placeholder>
          )}
          <Dots>
            <Dot $active /><Dot /><Dot />
          </Dots>
        </ImageCarousel>

        <Details>
          <CollectionLabel>FOUND Collection</CollectionLabel>
          <ProductName>{product.name}</ProductName>
          <ProductPrice>USD {product.price.toFixed(2)}</ProductPrice>

          <SizeLabel>Select size</SizeLabel>
          <SizeGrid>
            {sizes.map(s => (
              <SizeBtn key={s} $active={selectedSize === s} onClick={() => setSelectedSize(s)}>
                {s}
              </SizeBtn>
            ))}
          </SizeGrid>

          <AddToCartBtn onClick={handleAddToCart} $added={added}>
            {added ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Added to cart
              </>
            ) : 'Add to cart'}
          </AddToCartBtn>

          <WhatsAppBtn href={`https://wa.me/263777495801?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Inquire via WhatsApp
          </WhatsAppBtn>

          {product.description && <Description>{product.description}</Description>}
        </Details>
      </Grid>
    </PageWrap>
  );
};

export default ProductDetailPage;
