import React, { useState } from 'react';
import { X, Sparkles, Check, Lock } from 'lucide-react';

export default function AccountModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-content" style={{ maxWidth: '520px', padding: '0', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        {/* Banner Image */}
        <div style={{ position: 'relative', height: '160px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', textAlign: 'center', padding: '20px' }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', color: '#FFF', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '6px' }}
          >
            <X size={20} />
          </button>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '12px', marginBottom: '8px' }}>
              <Sparkles size={14} color="#D4AF37" /> ALO ACCESS VIP REWARDS
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '0.05em' }}>
              {isSignUp ? 'WANT 10% OFF YOUR FIRST ORDER?' : 'WELCOME BACK TO ALO'}
            </h2>
          </div>
        </div>

        {/* Modal Form */}
        <div style={{ padding: '32px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '56px', height: '56px', background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Check size={32} color="#D4AF37" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>YOU'RE ON THE LIST!</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>
                Use code <strong style={{ color: '#000', background: '#F4F4F0', padding: '4px 10px', borderRadius: '4px' }}>ALO10</strong> at checkout for 10% off your purchase.
              </p>
              <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
                START SHOPPING WITH 10% OFF
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 16px', marginBottom: '14px', border: '1px solid #CCC', fontSize: '0.85rem', outline: 'none' }}
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', marginBottom: '14px', border: '1px solid #CCC', fontSize: '0.85rem', outline: 'none' }}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', marginBottom: '20px', border: '1px solid #CCC', fontSize: '0.85rem', outline: 'none' }}
              />

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px 0', marginBottom: '16px' }}>
                {isSignUp ? 'JOIN ALO ACCESS & GET 10% OFF' : 'SIGN IN TO YOUR ACCOUNT'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
                {isSignUp ? 'Already a member?' : 'New to Alo?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  style={{ fontWeight: 700, color: '#000', textDecoration: 'underline' }}
                >
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </button>
              </div>

              <p style={{ fontSize: '0.7rem', color: '#999', textAlign: 'center', marginTop: '16px' }}>
                <Lock size={10} /> By joining you agree to Alo Yoga's Terms of Service and Privacy Policy.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
