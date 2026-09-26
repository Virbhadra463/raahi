import React, { useState } from 'react';
import { ARTISAN_VENDORS } from '../data/mockData';
import { ArtisanVendor, UserProfile } from '../types';
import { Coins, Check, ShieldCheck, Copy, Tag } from 'lucide-react';
import { playClickSound, playCoinSound, playStampSound } from '../utils/audio';

interface ArtisanMarketplaceProps {
  user: UserProfile;
  onRedeemVoucher: (vendor: ArtisanVendor) => void;
}

export const ArtisanMarketplace: React.FC<ArtisanMarketplaceProps> = ({ user, onRedeemVoucher }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    playClickSound();
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-10">

      {/* ─── HERO HEADER ─── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundImage: "url('/warli-bg.jpg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '220px 220px',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(33, 1, 0, 0.82)' }} />
        {/* Gold bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#E5A532] via-[#FFD38A] to-[#E5A532]" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-7 sm:p-9">
          <div>
            <span className="stamp-badge bg-[#7A1026] text-white border-[#E85B70] mb-3 inline-flex">
              GI Craft & Cooperative Guild
            </span>
            <h2 className="font-[Poppins] font-black text-2xl sm:text-3xl text-white leading-tight">
              Redeem Tokens for<br />
              <span className="text-[#FFD38A]">Real Handcrafted Wonders</span>
            </h2>
            <p className="text-[12px] text-white/65 mt-2 max-w-lg leading-relaxed">
              100% of redemptions go directly to artisans & women-led weaver cooperatives. Zero middlemen.
            </p>
          </div>

          {/* Balance widget */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-[#FFD38A]/30 rounded-xl p-4 text-center min-w-[130px]">
            <p className="text-[10px] uppercase tracking-widest text-[#FFD38A] font-bold mb-1">T-Coins</p>
            <div className="flex items-center justify-center gap-1.5">
              <Coins className="w-5 h-5 text-[#E5A532]" />
              <span className="font-black text-3xl text-white">{user.coins}</span>
            </div>
            <p className="text-[9px] text-white/50 mt-1">Complete quests to earn more</p>
          </div>
        </div>
      </div>

      {/* ─── ACTIVE VOUCHERS ─── */}
      {user.redeemedVouchers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#7A1026]" />
            <h3 className="font-[Poppins] font-bold text-sm uppercase tracking-wider text-[#120C2B] section-rule">
              Active Vouchers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.redeemedVouchers.map((v) => (
              <div
                key={v.id}
                className="relative flex items-center justify-between bg-white rounded-xl border border-[#7A1026]/40 overflow-hidden ticket-edge"
                style={{ boxShadow: '3px 3px 0px #7A102620' }}
              >
                {/* Left colored stripe */}
                <div className="w-2 self-stretch bg-gradient-to-b from-[#7A1026] to-[#E85B70] shrink-0" />
                
                <div className="flex-1 px-4 py-3 space-y-0.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#7A1026]">Verified Coupon</span>
                  <p className="font-bold text-sm text-[#1C1440]">{v.discount}</p>
                  <p className="text-[10px] text-[#8A8635] font-medium">{v.artisanName}</p>
                  <code className="block text-[10px] font-mono font-bold text-[#120C2B] bg-[#FCEFD9] px-2 py-0.5 rounded mt-1 w-fit">
                    {v.code}
                  </code>
                </div>

                <button
                  onClick={() => handleCopy(v.code)}
                  className="shrink-0 mr-3 p-2 rounded-lg bg-[#FFF9F3] hover:bg-[#FCEFD9] text-[#7A1026] border border-[#FFA6B4]/40 transition-all"
                >
                  {copiedCode === v.code ? <Check className="w-4 h-4 text-[#889063]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── ARTISAN CARDS ─── */}
      <div className="space-y-5">
        <h3 className="font-[Poppins] font-bold text-sm uppercase tracking-wider text-[#120C2B] flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#7A1026] animate-live-dot" />
          Featured Master Artisans
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTISAN_VENDORS.map((artisan) => {
            const canAfford = user.coins >= artisan.tokenCost;
            const isRedeemed = user.redeemedVouchers.some((v) => v.artisanName.includes(artisan.name));

            return (
              <div
                key={artisan.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(174,67,30,0.15)]"
                style={{ border: '1.5px solid #FFA6B430', boxShadow: '0 2px 10px rgba(33,1,0,0.06)' }}
              >
                {/* Warli accent top band */}
                <div
                  className="h-2 w-full warli-accent-strip"
                  style={{ minHeight: '8px' }}
                >
                  <div className="absolute inset-0" style={{ background: 'rgba(174,67,30,0.8)' }} />
                </div>

                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-[#FCEFD9]">
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1440]/75 via-transparent to-transparent" />

                  {/* Verified badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold text-[#120C2B]">
                    <ShieldCheck className="w-3 h-3 text-[#889063]" />
                    {artisan.yearsOfTradition}y tradition
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3">
                    <h4 className="font-[Poppins] font-bold text-white text-base leading-snug">{artisan.name}</h4>
                    <p className="text-[10px] text-[#FFD38A] font-medium">{artisan.shopName}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col p-4 gap-3">
                  <div className="space-y-1">
                    <span className="stamp-badge text-[#7A1026] border-[#7A1026] bg-[#FFF9F3]">
                      {artisan.craft}
                    </span>
                    <p className="text-[11px] text-[#120C2B] leading-relaxed line-clamp-2 mt-1">{artisan.bio}</p>
                    <div className="text-[11px] bg-[#FFF9F3] border border-[#FFE4B5] rounded-lg px-3 py-2 text-[#1C1440] mt-1">
                      <span className="font-bold text-[#E85B70]">Signature: </span>
                      {artisan.specialtyProduct}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-[#FFA6B4]/20 flex items-center justify-between gap-2 mt-auto">
                    <div>
                      <p className="text-xs font-bold text-[#1C1440]">{artisan.voucherDiscount}</p>
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-[#9C1A35] mt-0.5">
                        <Coins className="w-3 h-3 text-[#E5A532]" />
                        {artisan.tokenCost} T-Coins
                      </div>
                    </div>

                    <button
                      disabled={!canAfford || isRedeemed}
                      onClick={() => { playStampSound(); onRedeemVoucher(artisan); }}
                      className={`text-[11px] font-bold px-3.5 py-2 rounded-xl uppercase tracking-wide transition-all ${
                        isRedeemed
                          ? 'bg-[#FCEFD9] text-[#889063] border border-[#FFE4B5] cursor-default'
                          : canAfford
                          ? 'btn-terracotta py-2 px-3.5 text-[11px] rounded-xl'
                          : 'bg-[#FCEFD9] text-[#120C2B]/50 border border-[#FFE4B5] cursor-not-allowed'
                      }`}
                    >
                      {isRedeemed ? (
                        <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Redeemed</span>
                      ) : canAfford ? (
                        'Redeem'
                      ) : (
                        `Need ${artisan.tokenCost - user.coins} more`
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
