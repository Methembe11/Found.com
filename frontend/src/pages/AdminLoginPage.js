import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { adminLogin } from '../context/api';

const PageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 380px;
`;

const Logo = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 28px;
  font-weight: 400;
  letter-spacing: -0.02em;
  text-align: center;
  margin-bottom: 0.25rem;
`;

const Subtitle = styled.p`
  font-size: 12px;
  text-align: center;
  color: #9a9890;
  text-transform: uppercase;
  letter-spacing: 0.25em;
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
  transition: border-color 0.15s;

  &:focus {
    border-color: #0a0a0a;
  }
`;

const LoginBtn = styled.button`
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
`;

const ErrorMsg = styled.p`
  font-size: 13px;
  color: #ef4444;
  margin-top: 0.75rem;
  text-align: center;
`;

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await adminLogin(username, password);
      if (data.token) {
        localStorage.setItem('found_admin_token', data.token);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <Card>
        <Logo>FOUND</Logo>
        <Subtitle>Admin panel</Subtitle>
        <form onSubmit={handleLogin}>
          <FormGroup>
            <Label>Username</Label>
            <Input placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </FormGroup>
          <LoginBtn type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </LoginBtn>
        </form>
        {error && <ErrorMsg>{error}</ErrorMsg>}
      </Card>
    </PageWrap>
  );
};

export default AdminLoginPage;
