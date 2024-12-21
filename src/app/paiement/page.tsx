"use client";

import CommandeForm from "@lib/StripeLib/components/CommandeForm";

const CommandePage: React.FC = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <CommandeForm/>
        </main>
    )
}
export default CommandePage