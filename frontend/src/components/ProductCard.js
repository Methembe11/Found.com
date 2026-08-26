import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled(Link)`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background: #fafaf8;
  text-decoration: none;
  color: inherit;
  display: block;
`;

const ImgWrap = styled.div`
  overflow: hidden;
  background: #f0efe9;
  aspect-ratio: 3/4;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImgInner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0efe9;
  transition: transform 0.45s ease;

  ${Card}:hover & {
    transform: scale(1.04);
  }
`;

const Placeholder = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 48px;
  color: #e2e0d8;
  font-weight: 300;
`;

const Badge = styled.span`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: #0a0a0a;
  color: #fafaf8;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  padding: 0.25rem 0.5rem;
  z-index: 1;
`;

const Info = styled.div`
  padding: 0.75rem 0.5rem;
`;

const Category = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #9a9890;
  margin-bottom: 0.25rem;
`;

const Name = styled.div`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 15px;
  font-weight: 400;
  margin-bottom: 0.25rem;
  line-height: 1.3;
`;

const Price = styled.div`
  font-size: 13px;
  font-weight: 400;
`;

const ProductCard = ({ product }) => {
  return (
    <Card to={`/product/${product.id}`}>
      <ImgWrap>
        {product.badge && <Badge>{product.badge}</Badge>}
        <ImgInner>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Placeholder>F</Placeholder>
          )}
        </ImgInner>
      </ImgWrap>
      <Info>
        <Category>{product.category}</Category>
        <Name>{product.name}</Name>
        <Price>USD {product.price.toFixed(2)}</Price>
      </Info>
    </Card>
  );
};

export default ProductCard;
