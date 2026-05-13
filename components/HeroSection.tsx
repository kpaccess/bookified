import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

const steps = [
  {
    title: "Upload PDF",
    description: "Add your book file",
  },
  {
    title: "AI Processing",
    description: "We analyze the content",
  },
  {
    title: "Voice Chat",
    description: "Discuss with AI",
  },
];

type HeroSectionProps = {
  addBookHref: string;
};

export default function HeroSection({ addBookHref }: HeroSectionProps) {
  return (
    <section className="wrapper mb-10 md:mb-10">
      <section className="library-hero-card">
        <div className="library-hero-content">
          <div className="library-hero-text">
            <h1 className="library-hero-title">Your Library</h1>
            <p className="library-hero-description">
              Convert your books into interactive AI conversations.
              <br />
              Listen, learn, and discuss your favorite reads.
            </p>
            <Link href={addBookHref} className="library-cta-primary">
              <Plus className="size-6" strokeWidth={2} />
              <span>Add new book</span>
            </Link>
          </div>

          <div className="library-hero-illustration-desktop" aria-hidden="true">
            <Image
              src="/assets/hero-illustration.png"
              alt=""
              width={491}
              height={352}
              priority
              className="h-auto w-full max-w-[360px] object-contain"
            />
          </div>

          <div className="library-hero-illustration" aria-hidden="true">
            <Image
              src="/assets/hero-illustration.png"
              alt=""
              width={491}
              height={352}
              priority
              className="h-auto w-full max-w-[320px] object-contain"
            />
          </div>

          <div className="library-steps-card" aria-label="How Bookfied works">
            {steps.map((step, index) => (
              <div className="library-step-item" key={step.title}>
                <span className="library-step-number">{index + 1}</span>
                <div>
                  <h2 className="library-step-title">{step.title}</h2>
                  <p className="library-step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
