const platforms = [
  "Amazon",
  "Barnes & Noble",
  "Apple Books",
  "Google Books",
  "Kobo",
  "IngramSpark",
  "Draft2Digital",
  "Audible",
  "Blurb",
  "Gardners",
  "Tolino",
];

export function PlatformMarquee() {
  const items = [...platforms, ...platforms];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
      <div className="flex w-max animate-marquee gap-12 py-6">
        {items.map((p, i) => (
          <span
            key={i}
            className="font-serif text-2xl font-semibold tracking-tight text-navy/55 transition hover:text-navy md:text-3xl"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
