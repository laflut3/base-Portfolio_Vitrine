"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/utils/NavBar/Navbar";
import NavbarAdmin from "@/components/utils/NavBar/AdminNavBar";

export default function ClientNavbar() {
    const pathname = usePathname();
    const isAdminPath = pathname.includes("/admin");
    return isAdminPath ? <NavbarAdmin/> : <Navbar/>;
}