"use client"

import RegistrationForm from "@lib/UserLib/component/auth/RegistrationForm";

export default function RegisterPage() {

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <RegistrationForm/>
        </main>
    );
}
