"use client";

import React from "react";
import ContactForm from "@lib/Contact/component/ContactForm";

export default function ContactPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <ContactForm/>
        </main>
    );
}
