import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Type,
  CheckCircle2,
  XCircle,
  Sparkles,
  Rocket,
  HelpCircle,
  Phone,
  Mail,
  Upload,
  ArrowRight,
  ArrowLeft,
  Library,
  Wand2,
} from "lucide-react";

const TOTAL = 12;

type Data = {
  contributor?: "writer" | "ghostwriter";
  firstName?: string;
  lastName?: string;
  projectTitle?: string;
  completion?: 30 | 60 | 90;
  nextStep?: "walkthrough" | "finish";
  genre?: "fiction" | "nonfiction";
  subGenre?: string;
  needsEditing?: "yes" | "no";
  topic?: string;
  scope?: string;
  editTier?: "basic" | "standard";
  formatTier?: "basic" | "standard";
  publishTier?: "basic" | "standard";
  brief?: string;
  email?: string;
  phone?: string;
  fileName?: string;
};

function ProgressBar({ step }: { step: number }) {
  const pct = (step / TOTAL) * 100;
  return (
    <div className="sticky top-0 z-10 bg-white">
      <div className="h-1 w-full bg-navy/10">
        <motion.div
          className="h-full bg-navy"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <p className="px-5 pt-3 text-xs font-semibold uppercase tracking-widest text-navy/60">
        Step {step} of {TOTAL}
      </p>
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="font-serif text-3xl font-bold text-navy md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-navy/60">{subtitle}</p>}
    </div>
  );
}

function SelectCard({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-4 rounded-2xl border-2 bg-white p-8 text-center transition ${
        active
          ? "border-navy shadow-xl shadow-navy/15"
          : "border-navy/15 hover:border-navy/40 hover:shadow-lg"
      }`}
    >
      {active && (
        <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-navy/80 text-white">
          <CheckCircle2 className="size-4" />
        </span>
      )}
      {children}
    </button>
  );
}

function RadialProgress({ value }: { value: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg viewBox="0 0 100 100" className="size-24">
      <circle cx="50" cy="50" r={r} stroke="rgba(11,31,75,0.1)" strokeWidth="8" fill="none" />
      <circle
        cx="50"
        cy="50"
        r={r}
        stroke="#0B1F4B"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill="#0B1F4B"
      >
        {value}%
      </text>
    </svg>
  );
}

function PricingCard({
  active,
  onClick,
  title,
  features,
  highlighted,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col gap-4 rounded-2xl border-2 p-7 text-left transition ${
        active
          ? "border-navy bg-white shadow-xl shadow-navy/15"
          : highlighted
            ? "border-brand-red/40 bg-white hover:shadow-lg"
            : "border-navy/15 bg-white hover:border-navy/40 hover:shadow-lg"
      }`}
    >
      {active && (
        <span className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-navy/80 text-white">
          <CheckCircle2 className="size-4" />
        </span>
      )}
      <h3 className="font-serif text-2xl font-bold text-navy">{title}</h3>
      <ul className="space-y-2 text-sm text-navy/75">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-red" />
            {f}
          </li>
        ))}
      </ul>
    </button>
  );
}

const subFiction = ["Romance", "Thriller", "Fantasy", "Sci-Fi", "Mystery", "Literary"];
const subNonFiction = ["Memoir", "Self-Help", "Business", "Biography", "Health", "How-To"];

export function GetPublishedWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Data>({});
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof Data>(k: K, v: Data[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const next = () => setStep((s) => Math.min(TOTAL, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const submit = () => setSubmitted(true);

  const stepNode = () => {
    switch (step) {
      case 1:
        return (
          <>
            <StepHeader title="Who is the contributor?" />
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectCard
                active={data.contributor === "writer"}
                onClick={() => set("contributor", "writer")}
              >
                <BookOpen className="size-12 text-navy" />
                <span className="font-serif text-xl font-bold text-navy">
                  I am the writer
                </span>
                <span className="text-sm text-navy/60">
                  I have a manuscript or draft.
                </span>
              </SelectCard>
              <SelectCard
                active={data.contributor === "ghostwriter"}
                onClick={() => set("contributor", "ghostwriter")}
              >
                <Type className="size-12 text-navy" />
                <span className="font-serif text-xl font-bold text-navy">
                  I need ghostwriting
                </span>
                <span className="text-sm text-navy/60">
                  Help me bring my idea to life.
                </span>
              </SelectCard>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <StepHeader title="Tell us about your project" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="First Name"
                value={data.firstName}
                onChange={(v) => set("firstName", v)}
              />
              <Field
                label="Last Name"
                value={data.lastName}
                onChange={(v) => set("lastName", v)}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Project Title"
                  value={data.projectTitle}
                  onChange={(v) => set("projectTitle", v)}
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <StepHeader title="How far is your manuscript from completion?" />
            <div className="grid gap-5 sm:grid-cols-3">
              {[30, 60, 90].map((v) => (
                <SelectCard
                  key={v}
                  active={data.completion === v}
                  onClick={() => set("completion", v as 30 | 60 | 90)}
                >
                  <RadialProgress value={v} />
                  <span className="font-serif text-lg font-semibold text-navy">
                    {v}% complete
                  </span>
                </SelectCard>
              ))}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <StepHeader title="What is the next step you need?" />
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectCard
                active={data.nextStep === "walkthrough"}
                onClick={() => set("nextStep", "walkthrough")}
              >
                <HelpCircle className="size-12 text-navy" />
                <span className="font-serif text-lg font-bold text-navy">
                  Walk me through the services
                </span>
              </SelectCard>
              <SelectCard
                active={data.nextStep === "finish"}
                onClick={() => set("nextStep", "finish")}
              >
                <Wand2 className="size-12 text-navy" />
                <span className="font-serif text-lg font-bold text-navy">
                  Help me finish my manuscript
                </span>
              </SelectCard>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <StepHeader title="What is your book's genre?" />
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectCard
                active={data.genre === "nonfiction"}
                onClick={() => set("genre", "nonfiction")}
              >
                <Library className="size-12 text-navy" />
                <span className="font-serif text-xl font-bold text-navy">Non-Fiction</span>
              </SelectCard>
              <SelectCard
                active={data.genre === "fiction"}
                onClick={() => set("genre", "fiction")}
              >
                <Sparkles className="size-12 text-navy" />
                <span className="font-serif text-xl font-bold text-navy">Fiction</span>
              </SelectCard>
            </div>
          </>
        );
      case 6: {
        const opts = data.genre === "fiction" ? subFiction : subNonFiction;
        return (
          <>
            <StepHeader
              title="Choose a sub-genre"
              subtitle={`Refine your ${data.genre === "fiction" ? "fiction" : "non-fiction"} category.`}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              {opts.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => set("subGenre", o)}
                  className={`rounded-xl border-2 p-4 text-sm font-semibold transition ${
                    data.subGenre === o
                      ? "border-navy bg-navy text-white"
                      : "border-navy/15 bg-white text-navy hover:border-navy/40"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </>
        );
      }
      case 7:
        return (
          <>
            <StepHeader title="Does your book require editing and proofreading?" />
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectCard
                active={data.needsEditing === "yes"}
                onClick={() => set("needsEditing", "yes")}
              >
                <CheckCircle2 className="size-12 text-brand-red" />
                <span className="font-serif text-xl font-bold text-navy">Yes</span>
              </SelectCard>
              <SelectCard
                active={data.needsEditing === "no"}
                onClick={() => set("needsEditing", "no")}
              >
                <XCircle className="size-12 text-navy/50" />
                <span className="font-serif text-xl font-bold text-navy">No</span>
              </SelectCard>
            </div>
          </>
        );
      case 8:
        return (
          <>
            <StepHeader title="Topic & Scope" />
            <div className="space-y-4">
              <Field
                label="What is the topic / category of your book?"
                value={data.topic}
                onChange={(v) => set("topic", v)}
                textarea
              />
              <Field
                label="How many chapters and words are you targeting?"
                value={data.scope}
                onChange={(v) => set("scope", v)}
                textarea
              />
            </div>
          </>
        );
      case 9:
        return (
          <>
            <StepHeader title="Editing & Proofreading" />
            <div className="grid gap-5 sm:grid-cols-2">
              <PricingCard
                active={data.editTier === "basic"}
                onClick={() => set("editTier", "basic")}
                title="Basic"
                features={[
                  "Line editing",
                  "Developmental editing",
                  "Grammar",
                  "Punctuation",
                  "Spelling",
                ]}
              />
              <PricingCard
                active={data.editTier === "standard"}
                onClick={() => set("editTier", "standard")}
                title="Standard"
                highlighted
                features={[
                  "Storyline review",
                  "Timeline consistency",
                  "All Basic features",
                ]}
              />
            </div>
          </>
        );
      case 10:
        return (
          <>
            <StepHeader title="Book Formatting" />
            <div className="grid gap-5 sm:grid-cols-2">
              <PricingCard
                active={data.formatTier === "basic"}
                onClick={() => set("formatTier", "basic")}
                title="Basic"
                features={[
                  "Trim & page setup",
                  "Typesetting",
                  "Paragraph setup",
                  "Section setup",
                ]}
              />
              <PricingCard
                active={data.formatTier === "standard"}
                onClick={() => set("formatTier", "standard")}
                title="Standard"
                highlighted
                features={[
                  "Design elements",
                  "Dingbats",
                  "Theme setup",
                  "All Basic features",
                ]}
              />
            </div>
          </>
        );
      case 11:
        return (
          <>
            <StepHeader title="Book Publishing" />
            <div className="grid gap-5 sm:grid-cols-2">
              <PricingCard
                active={data.publishTier === "basic"}
                onClick={() => set("publishTier", "basic")}
                title="Basic"
                features={[
                  "Amazon (all formats)",
                  "Barnes & Noble (all formats)",
                ]}
              />
              <PricingCard
                active={data.publishTier === "standard"}
                onClick={() => set("publishTier", "standard")}
                title="Standard"
                highlighted
                features={[
                  "Amazon",
                  "Barnes & Noble",
                  "Kobo",
                  "Apple Books",
                  "Goodreads",
                ]}
              />
            </div>
          </>
        );
      case 12:
        return (
          <>
            <StepHeader
              title="Final details & contact"
              subtitle="Tell us anything else that helps us prepare for our call."
            />
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-4">
                <Field
                  label="Brief — describe your project"
                  value={data.brief}
                  onChange={(v) => set("brief", v)}
                  textarea
                  big
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-xl border border-navy/10 bg-offwhite p-3">
                    <Phone className="size-5 text-brand-red" />
                    <div className="text-xs text-navy/70">
                      <p className="font-semibold text-navy">Phone Support</p>
                      <p>24/7 from a real consultant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-navy/10 bg-offwhite p-3">
                    <Mail className="size-5 text-brand-red" />
                    <div className="text-xs text-navy/70">
                      <p className="font-semibold text-navy">Email Reply</p>
                      <p>Within 1 business hour</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="First Name"
                    value={data.firstName}
                    onChange={(v) => set("firstName", v)}
                  />
                  <Field
                    label="Last Name"
                    value={data.lastName}
                    onChange={(v) => set("lastName", v)}
                  />
                </div>
                <Field
                  label="Email"
                  value={data.email}
                  onChange={(v) => set("email", v)}
                  type="email"
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">
                    Phone
                  </label>
                  <div className="flex overflow-hidden rounded-md border border-navy/15 focus-within:border-brand-red">
                    <span className="flex items-center gap-1 border-r border-navy/15 bg-offwhite px-3 text-sm">
                      🇺🇸 +1
                    </span>
                    <input
                      type="tel"
                      value={data.phone || ""}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                      className="flex-1 px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <label
                htmlFor="awh-file"
                className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-navy/25 bg-offwhite p-6 text-center transition hover:border-brand-red"
              >
                <Upload className="size-10 text-brand-red" />
                <p className="font-serif text-lg font-semibold text-navy">
                  Drop your manuscript here
                </p>
                <p className="text-xs text-navy/55">
                  PDF, DOCX, or TXT — up to 50MB
                </p>
                {data.fileName && (
                  <p className="text-xs font-semibold text-brand-red">
                    {data.fileName}
                  </p>
                )}
                <input
                  id="awh-file"
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    set("fileName", e.target.files?.[0]?.name || undefined)
                  }
                />
              </label>
            </div>
          </>
        );
    }
  };

  if (submitted) {
    return (
      <section className="bg-white py-32">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <Rocket className="mx-auto size-14 text-brand-red" />
          <h2 className="mt-6 font-serif text-4xl font-bold text-navy">
            Your project is on its way!
          </h2>
          <p className="mt-4 text-navy/70">
            A senior publishing consultant will reach out within 1 business hour to start
            your free, confidential consultation.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-white">
      <ProgressBar step={step} />
      <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {stepNode()}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={step === 1}
            className="inline-flex items-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-navy/90 disabled:opacity-40"
          >
            <ArrowLeft className="size-4" /> Previous
          </button>
          {step < TOTAL ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 rounded-md bg-navy px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-navy/90"
            >
              Next <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              className="inline-flex items-center gap-2 rounded-md bg-brand-red px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-red/30 transition hover:bg-brand-red-dark"
              style={{ background: "linear-gradient(135deg, #C9A84C, #9C7A1F)" }}
            >
              Send My Project Details <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Floating help button */}
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="fixed bottom-5 left-5 z-30 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-navy/90"
      >
        <HelpCircle className="size-4" /> Need Help?
      </a>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea,
  big,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  big?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={big ? 6 : 3}
          className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm focus:border-brand-red focus:outline-none"
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm focus:border-brand-red focus:outline-none"
        />
      )}
    </div>
  );
}
