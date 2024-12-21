import type {Metadata} from 'next';
import React from "react";

import '@/styles/globals.css';
import {Provider} from "@/app/provider";
import Footer from "@/components/Footer"
import ClientNavbar from "@/components/ClientNavBar";
import CookiePopupManager from "@/components/utils/cookies/CookiePopupManager";
import CleanUpOrders from "@lib/OrderLib/component/CleanupOrder";

export const metadata: Metadata = {
  title: "Fleo-base",
  description: "Fleo web base pour tout les prochain site fleo",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({children}: { children: React.ReactNode; }) {
  return (
      <html lang="fr">
      <body className={`bodyGe`}>
      <Provider>
        <CleanUpOrders/>
        <ClientNavbar/>
        {children}
        <Footer/>
        <CookiePopupManager />
      </Provider>
      </body>
      </html>
  );
}
