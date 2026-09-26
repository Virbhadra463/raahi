import React, { useState, useEffect } from 'react';

const TAGLINES = [
  { text: 'हर गली एक कहानी है', lang: 'Hindi', script: 'हिन्दी' },
  { text: 'ہر گلی ایک کہانی ہے', lang: 'Urdu', script: 'اردو' },
  { text: 'প্রতিটি গলিরই একটি গল্প আছে', lang: 'Bengali', script: 'বাংলা' },
  { text: 'ஒவ்வொரு சந்துக்கும் ஒரு கதை உண்டு', lang: 'Tamil', script: 'தமிழ்' },
  { text: 'प्रत्येक गल्लीची एक गोष्ट आहे', lang: 'Marathi', script: 'मराठी' },
];

export default function TypewriterTagline() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentItem = TAGLINES[currentIdx];
    const fullText = currentItem.text;

    let timer;
    if (!isDeleting && displayedText !== fullText) {
      // Typing forward
      timer = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, 75);
    } else if (!isDeleting && displayedText === fullText) {
      // Pause at end of text before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    } else if (isDeleting && displayedText !== '') {
      // Backspacing
      timer = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length - 1));
      }, 35);
    } else if (isDeleting && displayedText === '') {
      // Switch to next language
      setIsDeleting(false);
      setCurrentIdx((prev) => (prev + 1) % TAGLINES.length);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentIdx]);

  const activeItem = TAGLINES[currentIdx];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Animated Text Container */}
      <div className="flex items-center min-h-[44px]">
        <span className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-marigold tracking-wide drop-shadow-md">
          "{displayedText}"
        </span>
        <span className="w-1 h-7 bg-signboard-pink inline-block ml-1 animate-pulse" />
      </div>

      {/* Language Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-signboard-navy/80 border border-marigold/50 text-[11px] font-bold text-parchment shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-marigold animate-ping" />
        <span className="text-marigold font-heading">{activeItem.script}</span>
        <span className="text-parchment/60">({activeItem.lang})</span>
      </div>
    </div>
  );
}
