'use client';

import { useEffect } from 'react';

export default function HistatsCounter() {
    useEffect(() => {
        // Prevent multiple injections
        if (document.getElementById('histats_counter_script')) return;

        const scriptId = 'histats_counter_script';

        // Define _Hasync globally
        (window as any)._Hasync = (window as any)._Hasync || [];
        (window as any)._Hasync.push(['Histats.start', '1,4995708,4,330,112,62,00011001']);
        (window as any)._Hasync.push(['Histats.fasi', '1']);
        (window as any)._Hasync.push(['Histats.track_hits', '']);

        const hs = document.createElement('script');
        hs.type = 'text/javascript';
        hs.async = true;
        hs.id = scriptId;
        hs.src = '//s10.histats.com/js15_as.js';

        const target = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0];
        target.appendChild(hs);

        return () => {
            // Clean up if needed, though usually Histats script persists
        };
    }, []);

    return (
        <div id="histats_counter" className="overflow-hidden rounded">
            {/* The script will inject the counter here */}
            <a href="https://www.histats.com/viewstats/?sid=4995708&ccid=330" target="_blank" rel="noopener noreferrer">
                <div className="w-[112px] h-[62px] bg-gray-800/50 animate-pulse rounded flex items-center justify-center text-[10px] text-gray-400">
                    Loading stats...
                </div>
            </a>
        </div>
    );
}
