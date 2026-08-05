import React from 'react';
import { Sparkles, ArrowRight, Gift, ShieldCheck, Zap } from 'lucide-react';

export default function LoyaltyBanner({ onOpenAccountModal }) {
  return (
    <section className="loyalty-banner-section">
      <div className="loyalty-banner-container">
        <div className="loyalty-content">
          <div className="loyalty-tag">
            <Sparkles size={16} color="#D4AF37" /> ALO ACCESS MEMBERSHIP
          </div>

          <h2 className="loyalty-heading">
            TURN YOUR STYLES INTO EXCLUSIVE REWARDS
          </h2>

          <p className="loyalty-desc font-serif">
            Join Alo Access today to unlock VIP drops, member-only sales, free two-day shipping, and invitations to studio events.
          </p>

          <div className="loyalty-perks-row">
            <div className="perk-item">
              <Gift size={20} color="#000" />
              <span>Welcome & Birthday Gifts</span>
            </div>
            <div className="perk-item">
              <Zap size={20} color="#000" />
              <span>Early Access to New Drops</span>
            </div>
            <div className="perk-item">
              <ShieldCheck size={20} color="#000" />
              <span>Free Express Worldwide Shipping</span>
            </div>
          </div>

          <button className="btn-primary" onClick={onOpenAccountModal}>
            JOIN ALO ACCESS & GET 10% OFF <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
