'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg1)]">
      {/* Sidebar - Fijo a la izquierda */}
      <Sidebar />
      
      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar - Fijo arriba del contenido */}
        <Topbar />
        
        {/* Área de Visualización */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full max-w-[1600px] mx-auto transition-all duration-700">
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className="pb-20"
           >
             {children}
           </motion.div>
        </main>
      </div>
    </div>
  );
}
