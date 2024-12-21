import ProductSection from "@lib/ProductLib/component/ProductSection";
import NewsLetterSection from "@lib/NewsLetterLib/component/NewsLetterSection";
import TestimonialsSection from "@lib/testimonialLib/component/TestimonialsSection";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <ProductSection/>
            <NewsLetterSection/>
            <TestimonialsSection/>
        </main>
    );
}
