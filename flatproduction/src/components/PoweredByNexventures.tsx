import React from 'react';

const PoweredByNexventures: React.FC<{ className?: string }> = ({ className = '' }) => (
  <a
    href="https://nexventures.net"
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-1.5 text-inherit no-underline opacity-70 hover:opacity-100 transition-opacity ${className}`}
  >
    Powered by <span className="font-bold">Nexventures Ltd</span>
  </a>
);

export default PoweredByNexventures;
