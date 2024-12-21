"use client";

import React from 'react';
import ResetForm from "@lib/UserLib/component/auth/forgot/ResetForm";

const ChangePassword: React.FC = () => {


    return (
        <main className="h-screen relative" style={{ background: "#3577B4" }}>
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50" style={{ backgroundImage: "url('/assets/image/bg/bg-montains.svg')" }}></div>
            <div className="flex items-center justify-center h-full w-full z-10">
                <ResetForm/>
            </div>
        </main>
    );
};

export default ChangePassword;
