import Testimonials from "@/components/sections/Testimonials";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedCollection from "@/components/sections/FeaturedCollection";
import StatsSection from "@/components/sections/StatsSection";
import AcademyHighlight from "@/components/sections/AcademyHighlight";
import Link from "next/link";
// import Button from "@/components/ui/Button"; // Consider using this if it handles routing/styling!

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AcademyHighlight />
      <FeaturedCollection />
      <Testimonials />
      
      {/* Contact CTA Banner */}
      <section className="py-20 bg-[#FAF7F4] border-t border-[#f0ebe3]">
        <div className="container-custom text-center">
          <p className="block mb-4 text-sm font-semibold tracking-widest text-[#C9A84C] uppercase">
            Get In Touch
          </p>
          
          <h2 className="mb-4 text-[clamp(1.75rem,4vw,3rem)] font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Ready to Begin Your Journey?
          </h2>
          
          <p className="max-w-[450px] mx-auto mb-10 text-[0.95rem] leading-[1.8] text-[#6b7280]">
            Whether you are looking for your next statement piece or ready to launch your fashion career — we are here for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* Primary Gold Button */}
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center min-w-[220px] px-10 py-3.5 bg-[#C9A84C] border-2 border-[#C9A84C] text-white text-[0.8rem] font-semibold tracking-[0.15em] uppercase no-underline transition-all duration-300 rounded-sm hover:bg-[#B49542] hover:border-[#B49542] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(201,168,76,0.4)]"
            >
              Contact Us
            </Link>
            
            {/* Outline Button */}
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center min-w-[220px] px-10 py-3.5 border-2 border-[#C9A84C] text-[#C9A84C] bg-transparent text-[0.8rem] font-semibold tracking-[0.15em] uppercase no-underline transition-all duration-300 rounded-sm hover:bg-[#C9A84C] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(201,168,76,0.2)]"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}