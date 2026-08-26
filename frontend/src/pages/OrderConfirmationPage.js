import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getOrderStatus } from '../context/api';

const PageWrap = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  text-align: center;
`;

const CheckIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
`;

const Title = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 0.75rem;
`;

const Message = styled.p`
  font-size: 14px;
  color: #9a9890;
  line-height: 1.6;
  margin-bottom: 0.5rem;
`;

const OrderRef = styled.div`
  font-size: 12px;
  color: #9a9890;
  margin: 1rem 0 2rem;
  padding: 0.75rem;
  background: #f0efe9;
  border-radius: 4px;
`;

const RefLabel = styled.span`
  font-weight: 500;
  color: #0a0a0a;
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

const WaitingBox = styled.div`
  background: #fef3c7;
  border: 1px solid #fcd34d;
  padding: 1.5rem;
  margin: 1.5rem 0;
  text-align: left;
`;

const WaitingTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: #92400e;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WaitingText = styled.p`
  font-size: 13px;
  color: #92400e;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(146, 64, 14, 0.3);
  border-top-color: #92400e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;

  @keyframes spin { to { transform: rotate(360deg); } }
`;

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (!id) return;
    const interval = setInterval(async () => {
      try {
        const data = await getOrderStatus(id);
        if (data.payment_status === 'confirmed') {
          setStatus('confirmed');
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setStatus('timeout');
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [id]);

  if (status === 'confirmed') {
    return (
      <PageWrap>
        <CheckIcon>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </CheckIcon>
        <Title>Thank you.</Title>
        <Message>Your order has been placed. We'll confirm and arrange delivery shortly.</Message>
        <Message>You will receive a confirmation on your phone.</Message>
        <OrderRef>Order reference: <RefLabel>{id}</RefLabel></OrderRef>
        <ContinueBtn to="/shop">Continue shopping</ContinueBtn>
      </PageWrap>
    );
  }

  if (status === 'timeout') {
    return (
      <PageWrap>
        <Title>Still waiting...</Title>
        <Message>We haven't received payment confirmation yet.</Message>
        <WaitingBox>
          <WaitingTitle>Check your phone</WaitingTitle>
          <WaitingText>If you completed the payment, please wait a few moments and try again.</WaitingText>
        </WaitingBox>
        <ContinueBtn to="/shop">Continue shopping</ContinueBtn>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <Title>Check your phone</Title>
      <Message>We're waiting for payment confirmation.</Message>
      <WaitingBox>
        <WaitingTitle><Spinner /> Processing payment...</WaitingTitle>
        <WaitingText>A payment prompt has been sent to your phone. Please enter your PIN to complete the transaction.</WaitingText>
      </WaitingBox>
      <OrderRef>Order reference: <RefLabel>{id}</RefLabel></OrderRef>
    </PageWrap>
  );
};

export default OrderConfirmationPage;
