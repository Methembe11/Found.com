import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { createOrder } from '../context/api';

const PageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Title = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.5rem, 5vw, 1.875rem);
  font-weight: 300;
  letter-spacing: -0.025em;
  margin-bottom: 1.5rem;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 380px;
  }
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionLabel = styled.h3`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-weight: 500;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e0d8;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  margin-bottom: 0.375rem;
  color: ${p => p.$required ? '#0a0a0a' : '#9a9890'};
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
  letter-spacing: 0.3px;
  transition: border-color 0.15s;

  &:focus {
    border-color: #0a0a0a;
  }
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
  letter-spacing: 0.3px;
  transition: border-color 0.15s;

  &:focus {
    border-color: #0a0a0a;
  }
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PaymentOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${p => p.$active ? '#0a0a0a' : '#e2e0d8'};
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover {
    border-color: #0a0a0a;
  }
`;

const RadioInput = styled.input`
  accent-color: #0a0a0a;
`;

const PaymentInfo = styled.div``;

const PaymentName = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const PaymentDesc = styled.div`
  font-size: 12px;
  color: #9a9890;
`;

const SummaryBox = styled.div`
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
  margin-bottom: 1rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(226, 224, 216, 0.5);
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 500;
  padding-top: 0.75rem;
  margin-top: 0.5rem;
  border-top: 1px solid #e2e0d8;
`;

const PayBtn = styled.button`
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
  font-family: 'Jost', sans-serif;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  transition: opacity 0.15s;

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(250, 250, 248, 0.3);
  border-top-color: #fafaf8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin { to { transform: rotate(360deg); } }
`;

const paymentMethods = [
  { id: 'ecocash', name: 'EcoCash', desc: 'Prompt sent to your phone' },
  { id: 'innbucks', name: 'Innbucks', desc: 'Prompt sent to your phone' },
  { id: 'omari', name: 'Omari', desc: 'Prompt sent to your phone' },
  { id: 'zimswitch', name: 'ZimSwitch', desc: 'Pay with your card' },
  { id: 'visa', name: 'Visa / Mastercard', desc: 'International card' },
];

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address: '', city: '', notes: '',
    payment_method: 'ecocash'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) return;
    setLoading(true);

    try {
      const order = await createOrder({
        guest: { name: form.name, phone: form.phone, email: form.email },
        address: `${form.address}, ${form.city}`,
        notes: form.notes,
        payment_method: form.payment_method,
        items: items.map(i => ({
          product_id: i.id,
          quantity: i.qty,
          size: i.size,
          unit_price: i.price
        })),
        total
      });
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <Title>Checkout</Title>
      <form onSubmit={handleSubmit}>
        <Layout>
          <div>
            <FormSection>
              <SectionLabel>Contact details</SectionLabel>
              <FormGroup>
                <Label $required>Full name *</Label>
                <Input name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label $required>Phone number *</Label>
                <Input name="phone" placeholder="0771234567" value={form.phone} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Email (optional)</Label>
                <Input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionLabel>Delivery address</SectionLabel>
              <FormGroup>
                <Label $required>Street address *</Label>
                <Input name="address" placeholder="123 Main Street" value={form.address} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label $required>City *</Label>
                <Input name="city" placeholder="Gweru" value={form.city} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Order notes</Label>
                <Textarea name="notes" placeholder="Optional" value={form.notes} onChange={handleChange} />
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionLabel>Payment method</SectionLabel>
              <PaymentOptions>
                {paymentMethods.map(pm => (
                  <PaymentOption key={pm.id} $active={form.payment_method === pm.id}>
                    <RadioInput
                      type="radio"
                      name="payment_method"
                      value={pm.id}
                      checked={form.payment_method === pm.id}
                      onChange={handleChange}
                    />
                    <PaymentInfo>
                      <PaymentName>{pm.name}</PaymentName>
                      <PaymentDesc>{pm.desc}</PaymentDesc>
                    </PaymentInfo>
                  </PaymentOption>
                ))}
              </PaymentOptions>
            </FormSection>
          </div>

          <SummaryBox>
            <SummaryTitle>Order summary</SummaryTitle>
            {items.map(item => (
              <SummaryItem key={`${item.id}-${item.size}`}>
                <span>{item.name} (x{item.qty})</span>
                <span>USD {(item.price * item.qty).toFixed(2)}</span>
              </SummaryItem>
            ))}
            <SummaryItem>
              <span>Delivery</span>
              <span style={{ color: '#9a9890' }}>Calculated at checkout</span>
            </SummaryItem>
            <SummaryTotal>
              <span>Total</span>
              <span>USD {total.toFixed(2)}</span>
            </SummaryTotal>
            <PayBtn type="submit" disabled={loading}>
              {loading && <Spinner />}
              {loading ? 'Processing...' : 'Place order'}
            </PayBtn>
          </SummaryBox>
        </Layout>
      </form>
    </PageWrap>
  );
};

export default CheckoutPage;
