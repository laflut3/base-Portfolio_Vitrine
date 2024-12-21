"use client";

import ProductForm from "@lib/UserLib/component/admin/product/AdminProductSection"

const AdminProductPage: React.FC = () => {
    return (
        <main className="relative flex items-center justify-center min-h-screen">
            <ProductForm/>
        </main>
    );
}

export default AdminProductPage;
