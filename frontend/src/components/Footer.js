import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterWrap = styled.footer`
  background: #0a0a0a;
  color: #fafaf8;
  padding: 3rem 1.5rem 1.5rem;
  margin-top: 4rem;

  @media (min-width: 768px) {
    padding: 4rem 2rem 1.5rem;
  }
`;

const Grid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
  }
`;

const Brand = styled.div``;

const Logo = styled(Link)`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: #fafaf8;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 0.75rem;
`;

const Tagline = styled.p`
  font-size: 13px;
  color: #9a9890;
  line-height: 1.6;
  max-width: 280px;
`;

const ColTitle = styled.h4`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #9a9890;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const FooterLink = styled(Link)`
  display: block;
  font-size: 13px;
  color: #fafaf8;
  text-decoration: none;
  padding: 0.25rem 0;
  transition: color 0.15s;
  &:hover { color: #9a9890; }
`;

const FooterText = styled.p`
  font-size: 13px;
  color: #fafaf8;
  padding: 0.25rem 0;
`;

const PaymentTag = styled.span`
  display: inline-block;
  border: 1px solid rgba(250, 250, 248, 0.25);
  padding: 0.25rem 0.5rem;
  font-size: 11px;
  margin: 0.15rem;
  border-radius: 2px;
`;

const BottomBar = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 1rem;
  border-top: 1px solid rgba(250, 250, 248, 0.15);
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #9a9890;
`;

const Footer = () => {
  return (
    <FooterWrap>
      <Grid>
        <Brand>
          <Logo to="/">FOUND</Logo>
          <Tagline>
            Premium fashion for the modern Zimbabwean. Gweru-based. Globally inspired.
          </Tagline>
        </Brand>

        <div>
          <ColTitle>Shop</ColTitle>
          <FooterLink to="/shop?cat=Men">Men</FooterLink>
          <FooterLink to="/shop?cat=Women">Women</FooterLink>
          <FooterLink to="/shop?cat=Accessories">Accessories</FooterLink>
          <FooterLink to="/shop?cat=New In">New In</FooterLink>
        </div>

        <div>
          <ColTitle>Help</ColTitle>
          <FooterText>Sizing guide</FooterText>
          <FooterText>Delivery info</FooterText>
          <FooterText>Returns policy</FooterText>
          <FooterText>Contact us</FooterText>
        </div>

        <div>
          <ColTitle>Payment</ColTitle>
          <PaymentTag>EcoCash</PaymentTag>
          <PaymentTag>Innbucks</PaymentTag>
          <PaymentTag>ZimSwitch</PaymentTag>
          <PaymentTag>Omari</PaymentTag>
          <PaymentTag>Visa</PaymentTag>
          <PaymentTag>Mastercard</PaymentTag>
        </div>
      </Grid>

      <BottomBar>
        <span>&copy; 2025 Applause &mdash; Gweru, Zimbabwe</span>
        <span>All rights reserved</span>
      </BottomBar>
    </FooterWrap>
  );
};

export default Footer;
