"use client";

import ForgotPassword from "@lib/UserLib/component/auth/forgot/ForgotForm";

const ForgotPage: React.FC = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <ForgotPassword/>
        </main>
    );
};

export default ForgotPage;
