import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { resolveImageUrl } from '../context/api';

const PageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const EmptyLogo = styled.div`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 80px;
  color: #e2e0d8;
  font-weight: 300;
  margin-bottom: 1rem;
`;

const EmptyText = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
`;

const ContinueBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  min-width: 200px;
  background: #0a0a0a;
  color: #fafaf8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  text-decoration: none;
  font-family: 'Jost', sans-serif;
  transition: opacity 0.15s;
  &:hover { opacity: 0.9; }
`;

const CartTitle = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.5rem, 5vw, 1.875rem);
  font-weight: 300;
  letter-spacing: -0.025em;
  margin-bottom: 1.5rem;

  em { font-style: italic; }
`;

const CartLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 380px;
  }
`;

const CartItems = styled.div``;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e0d8;
  align-items: start;
`;

const ItemImg = styled.div`
  width: 80px;
  height: 100px;
  background: #f0efe9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ItemPlaceholder = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 28px;
  color: #e2e0d8;
`;

const ItemInfo = styled.div``;

const ItemName = styled.div`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 15px;
  margin-bottom: 0.25rem;
`;

const ItemMeta = styled.div`
  font-size: 12px;
  color: #9a9890;
  margin-bottom: 0.75rem;
`;

const QtyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const QtyBtn = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid #e2e0d8;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  &:hover { border-color: #0a0a0a; }
`;

const QtyNum = styled.span`
  font-size: 13px;
  min-width: 20px;
  text-align: center;
`;

const RemoveBtn = styled.button`
  font-size: 11px;
  color: #9a9890;
  background: none;
  border: none;
  padding: 0;
  margin-top: 0.5rem;
  cursor: pointer;
  &:hover { color: #ef4444; }
`;

const ItemPrice = styled.div`
  font-size: 14px;
  white-space: nowrap;
`;

const Summary = styled.div`
  background: #f0efe9;
  padding: 1.5rem;

  @media (min-width: 768px) {
    position: sticky;
    top: 80px;
  }
`;

const SummaryTitle = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 300;
  margin-bottom: 1.5rem;

  em { font-style: italic; }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 0.5rem 0;
  ${p => p.$bold && `font-weight: 500; font-size: 15px; padding-top: 0.75rem; border-top: 1px solid #e2e0d8; margin-top: 0.5rem;`}
`;

const PromoInput = styled.div`
  display: flex;
  margin: 1rem 0;
  border: 1px solid #e2e0d8;
  height: 48px;
  background: #fafaf8;
`;

const PromoField = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 0 1rem;
  font-size: 13px;
  background: transparent;
  font-family: 'Jost', sans-serif;
`;

const PromoApply = styled.button`
  padding: 0 1rem;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  background: transparent;
  border: none;
  border-left: 1px solid #e2e0d8;
  cursor: pointer;
  font-family: 'Jost', sans-serif;
`;

const CheckoutBtn = styled(Link)`
  display: flex;
  width: 100%;
  height: 52px;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  color: #fafaf8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  text-decoration: none;
  font-family: 'Jost', sans-serif;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  transition: opacity 0.15s;
  &:hover { opacity: 0.9; }
`;

const WhatsAppOrderBtn = styled.a`
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
  text-decoration: none;
  font-family: 'Jost', sans-serif;
  cursor: pointer;
  margin-top: 0.75rem;
  transition: all 0.15s;
  &:hover {
    background: #25D366;
    border-color: #25D366;
    color: #fff;
  }
`;

const CartPage = () => {
  const { items, removeItem, updateQty, total } = useCart();
  const [promoCode, setPromoCode] = useState('');

  if (items.length === 0) {
    return (
      <PageWrap>
        <EmptyState>
          <EmptyLogo>F</EmptyLogo>
          <EmptyText>Your bag is empty</EmptyText>
          <ContinueBtn to="/shop">Continue shopping</ContinueBtn>
        </EmptyState>
      </PageWrap>
    );
  }

  const whatsappItems = items.map(i =>
    `${i.name} (Size: ${i.size}, Qty: ${i.qty}) - USD ${(i.price * i.qty).toFixed(2)}`
  ).join('%0A');
  const whatsappMsg = encodeURIComponent(
    `Hi FOUND, I'd like to order:%0A${whatsappItems}%0ATotal: USD ${total.toFixed(2)}`
  );

  return (
    <PageWrap>
      <CartTitle>Your <em>bag</em> ({items.length})</CartTitle>

      <CartLayout>
        <CartItems>
          {items.map(item => (
            <CartItem key={`${item.id}-${item.size}`}>
              <ItemImg>
                {item.image_url ? (
                  <img src={resolveImageUrl(item.image_url)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ItemPlaceholder>F</ItemPlaceholder>
                )}
              </ItemImg>
              <ItemInfo>
                <ItemName>{item.name}</ItemName>
                <ItemMeta>Size {item.size} &mdash; {item.category}</ItemMeta>
                <QtyControls>
                  <QtyBtn onClick={() => updateQty(item.id, item.size, item.qty - 1)}>-</QtyBtn>
                  <QtyNum>{item.qty}</QtyNum>
                  <QtyBtn onClick={() => updateQty(item.id, item.size, item.qty + 1)}>+</QtyBtn>
                </QtyControls>
                <RemoveBtn onClick={() => removeItem(item.id, item.size)}>Remove</RemoveBtn>
              </ItemInfo>
              <ItemPrice>USD {(item.price * item.qty).toFixed(2)}</ItemPrice>
            </CartItem>
          ))}
        </CartItems>

        <Summary>
          <SummaryTitle>Order <em>summary</em></SummaryTitle>
          <SummaryRow>
            <span>Subtotal</span>
            <span>USD {total.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Delivery</span>
            <span style={{ color: '#9a9890' }}>Calculated at checkout</span>
          </SummaryRow>
          <SummaryRow>
            <span>Discount</span>
            <span>USD 0.00</span>
          </SummaryRow>

          <PromoInput>
            <PromoField
              placeholder="Promo code"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
            />
            <PromoApply>Apply</PromoApply>
          </PromoInput>

          <SummaryRow $bold>
            <span>Total</span>
            <span>USD {total.toFixed(2)}</span>
          </SummaryRow>

          <CheckoutBtn to="/checkout">Proceed to checkout</CheckoutBtn>
          <WhatsAppOrderBtn href={`https://wa.me/263777495801?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
            Pay via WhatsApp instead
          </WhatsAppOrderBtn>
        </Summary>
      </CartLayout>
    </PageWrap>
  );
};

export default CartPage;
