'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';

import { animate, stagger } from 'animejs';
import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import Roles from '@/components/home/Roles';
import Features from '@/components/home/Features';
import Security from '@/components/home/Security';
import Footer from '@/components/home/Footer';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animate('.nav-item', {
      opacity: [0, 1],
      y: [-20, 0],
      delay: stagger(80),
      duration: 800,
      easing: 'easeOutExpo',
    });

    animate('.hero-title', {
      opacity: [0, 1],
      y: [60, 0],
      duration: 1000,
      delay: 300,
      easing: 'easeOutExpo',
    });

    animate('.hero-sub', {
      opacity: [0, 1],
      y: [30, 0],
      duration: 900,
      delay: 500,
      easing: 'easeOutExpo',
    });

    animate('.hero-btn', {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      delay: stagger(100, { start: 700 }),
      easing: 'easeOutExpo',
    });

    animate('.stat-item', {
      opacity: [0, 1],
      y: [30, 0],
      delay: stagger(120, { start: 600 }),
      duration: 900,
      easing: 'easeOutExpo',
    });

    animate('.card-item', {
      opacity: [0, 1],
      scale: [0.92, 1],
      delay: stagger(150, { start: 800 }),
      duration: 1000,
      easing: 'easeOutExpo',
    });

    animate('.bg-orb', {
      translateX: [-20, 20],
      translateY: [-15, 15],
      duration: 5000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
    });
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-[#080412] text-[#371851] dark:text-white overflow-x-hidden">

      {/* Orbs de fondo */}
      <div className="bg-orb fixed top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#371851]/10 dark:bg-[#371851]/25 blur-[120px] pointer-events-none z-0" />
      <div className="bg-orb fixed bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#18B0C6]/10 dark:bg-[#18B0C6]/15 blur-[100px] pointer-events-none z-0" />

      {/* Navbar flotante */}
      <Navbar/>

      {/* Hero */}
      <Hero/>

      {/* Roles */}
      <Roles/>

      {/* Features */}
      <Features/>

      {/* Seguridad banner */}
      <Security/>

      {/* Footer */}
      <Footer/>

    </main>
  );
}