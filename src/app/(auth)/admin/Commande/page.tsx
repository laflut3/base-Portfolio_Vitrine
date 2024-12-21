"use client";

import React from "react";
import AdminOrderSection from "@lib/UserLib/component/admin/order/AdminOrderSection";

const AdminCommandePage: React.FC = () => {
    return (
        <main className="relative flex items-center justify-center min-h-screen">
            <AdminOrderSection/>
        </main>
    )
}
export default AdminCommandePage
