import { Metadata } from "next";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with SHOE MAFIA — premium footwear store in Bilaspur, Chhattisgarh.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Contact <span className="text-red-500">Us</span>
        </h1>
        <p className="text-white/60 max-w-xl mx-auto">
          Visit our store or reach out to us. We&apos;re here to help you find the perfect pair.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-6 luxury-border">
            <h2 className="font-display text-2xl font-bold text-white mb-6">SHOE MAFIA</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <p className="text-white font-medium">Address</p>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Bus Stand, Old Telephone Exchange Road,<br />
                    Telipara, Bilaspur,<br />
                    Chhattisgarh 495001
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-red-500 shrink-0" />
                <div>
                  <p className="text-white font-medium">Phone</p>
                  <a href="tel:07587555558" className="text-white/60 hover:text-red-400 transition-colors">
                    07587555558
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <a
                href="tel:07587555558"
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
              <a
                href="https://wa.me/917587555558"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="glass-card overflow-hidden luxury-border h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.5!2d82.139!3d22.079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDA0JzQ0LjQiTiA4MsKwMDgnMjAuNCJF!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SHOE MAFIA Location"
            />
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
