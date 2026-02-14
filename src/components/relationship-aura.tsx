'use client';

import { motion } from 'framer-motion';
import { AuraColor } from '@/lib/analyze-chat';
import { getAuraGradient, getAuraGlowColor } from '@/lib/analyze-chat';

interface RelationshipAuraProps {
  auraColor: AuraColor;
  vibeScore: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function RelationshipAura({ auraColor, vibeScore, size = 'lg' }: RelationshipAuraProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  const glowSize = {
    sm: 20,
    md: 40,
    lg: 60
  };

  const pulseIntensity = vibeScore >= 75 ? 1.2 : vibeScore >= 50 ? 1.1 : 1.05;

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto`}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, ${getAuraGlowColor(auraColor)}, transparent, ${getAuraGlowColor(auraColor)})`,
          filter: 'blur(8px)',
        }}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: {
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
      />

      {/* Main orb */}
      <motion.div
        className="absolute inset-2 rounded-full"
        style={{
          background: getAuraGradient(auraColor),
          boxShadow: `0 0 ${glowSize[size]}px ${getAuraGlowColor(auraColor)}`
        }}
        animate={{
          scale: [1, pulseIntensity, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute inset-4 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)`
        }}
        animate={{
          rotate: -360
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Score display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-center"
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            {vibeScore}
          </div>
          <div className="text-xs text-white/80 mt-1">VIBE</div>
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size === 'sm' ? '4px' : size === 'md' ? '6px' : '8px',
            height: size === 'sm' ? '4px' : size === 'md' ? '6px' : '8px',
            background: getAuraGlowColor(auraColor),
            boxShadow: `0 0 10px ${getAuraGlowColor(auraColor)}`
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.sin(i * 60 * (Math.PI / 180)) * 10, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}
