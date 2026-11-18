import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { bookingUrl, contactEmail, whatsappLink } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Contact",
  "Write to Realization: a short message, WhatsApp, email, or a 20-minute intro call. For a property, venture or capital brief, use the opportunity form.",
  "/contact",
);

/** The short, general way in. The long opportunity brief stays on /bring-an-opportunity. */
export default function ContactPage() {
  return (
    <>
      <PageHero
        index="@"
        eyebrow="CONTACT"
        title="A few lines | are enough."
        intro="A question, an idea or a first hello. | Write here, or pick the channel you already use."
        theme="light"
      />
      <section className="section">
        <div className="container-wide opportunity-layout">
          <aside className="opportunity-intro">
            <p className="eyebrow">OTHER WAYS IN</p>
            <ul className="contact-channels">
              <li>
                <a href={whatsappLink("Hi Realization, I have a question:")} rel="noopener" data-umami-event="whatsapp" data-umami-event-place="contact">
                  <MessageCircle aria-hidden="true" size={20} /><span>WhatsApp</span><ArrowUpRight aria-hidden="true" size={16} />
                </a>
              </li>
              <li>
                <a href={`mailto:${contactEmail}`} data-umami-event="email" data-umami-event-place="contact">
                  <Mail aria-hidden="true" size={20} /><span>{contactEmail}</span><ArrowUpRight aria-hidden="true" size={16} />
                </a>
              </li>
              <li>
                <a href={bookingUrl} target="_blank" rel="noopener" data-umami-event="book-intro" data-umami-event-place="contact">
                  <CalendarDays aria-hidden="true" size={20} /><span>Book a 20-minute intro</span><ArrowUpRight aria-hidden="true" size={16} />
                </a>
              </li>
            </ul>
            <p className="contact-brief">
              Bringing a property, a venture or capital? <Link href="/bring-an-opportunity">The opportunity brief</Link> asks the questions we would ask.
            </p>
          </aside>
          <Suspense fallback={<div className="opportunity-form">Loading the form…</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
