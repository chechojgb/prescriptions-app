"use client";

import { useEffect, useRef } from 'react';
import { animate, svg, stagger } from 'animejs';
import { Pill } from 'lucide-react';
import Image from 'next/image';

export default function AppLogo() {
    const svgRef = useRef(null);

    useEffect(() => {
        // Animamos el trazado de las letras en mayúsculas
        animate(svg.createDrawable('.rx-line'), {
            draw: ['0 0', '0 1', '1 1'],
            ease: 'inOutQuad',
            duration: 2500,
            delay: stagger(150),
            loop: true
        });
    }, []);

    return (
        <>
            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden">
                <Image
                    src="/image/logo/zallar.png"
                    alt="Logo"
                    width={20}
                    height={20}
                    className="object-contain"/>
            </div>
            
            <div className="ml-3 flex items-center">
                <svg 
                    ref={svgRef}
                    viewBox="0 0 520 60" 
                    className="h-5 w-auto"
                >
                    <g 
                        stroke="currentColor" 
                        fill="none" 
                        fillRule="evenodd" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="5" 
                        className="text-[#371851] dark:text-white"
                    >
                        {/* R */}
                        <path className="rx-line" d="M10 45V15h20c8 0 8 12 0 12h-20M25 27l15 18" />
                        {/* X */}
                        <path className="rx-line" d="M55 15l25 30M80 15L55 45" />
                        
                        {/* S */}
                        <path className="rx-line" d="M130 15h-20c-5 0-5 10 0 10h10c5 0 5 10 0 10h-20" />
                        {/* Y */}
                        <path className="rx-line" d="M150 15l15 15 15-15M165 30v15" />
                        {/* S */}
                        <path className="rx-line" d="M215 15h-20c-5 0-5 10 0 10h10c5 0 5 10 0 10h-20" />
                        {/* T */}
                        <path className="rx-line" d="M235 15h30M250 15v30" />
                        {/* E */}
                        <path className="rx-line" d="M310 15h-25v30h25M285 30h20" />
                        {/* M */}
                        <path className="rx-line" d="M330 45V15l15 15 15-15v30" />
                    </g>
                </svg>
            </div>
        </>
    );
}