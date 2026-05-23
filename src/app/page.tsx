import Image from "next/image";

const dishes = [
  {
    name: "Charred coconut curry",
    description:
      "Slow-built aromatics, smoked chile oil, and market greens folded into a velvet coconut base.",
    accent: "Bangkok dusk",
  },
  {
    name: "Golden herb rice",
    description:
      "Jasmine rice glazed with turmeric, citrus leaf, roasted shallots, and young coriander.",
    accent: "Fragrant course",
  },
  {
    name: "Tamarind garden plate",
    description:
      "Bright tamarind, crisp herbs, toasted seeds, and seasonal vegetables cut for balance.",
    accent: "Chef's selection",
  },
];

const navItems = ["Story", "Menu", "Private Table"];

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#061a12] text-[#f9f2df]">
      <div className="pointer-events-none fixed inset-0 -z-20 opacity-20 mix-blend-screen">
        <Image
          src="/landing-assets/bg-leaves.svg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_70%_8%,rgba(226,179,94,0.24),transparent_34%),linear-gradient(180deg,rgba(6,26,18,0.78),#061a12_48%,#04110c)]" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 sm:px-10 lg:px-12">
        <a href="#" className="flex items-center gap-3" aria-label="Saffron & Leaf">
          <span className="grid size-11 place-items-center rounded-full border border-[#d6ad60]/30 bg-[#f7e5bd]/10">
            <Image
              src="/landing-assets/logo-mark.svg"
              alt=""
              aria-hidden="true"
              width={28}
              height={28}
              className="size-7"
            />
          </span>
          <span className="font-serif text-xl tracking-wide text-[#fff8e8]">
            Saffron & Leaf
          </span>
        </a>

        <nav className="hidden items-center gap-9 text-sm font-medium text-[#dfd2b5] md:flex">
          {navItems.map((item) => (
            <a key={item} href="#" className="transition hover:text-[#f5c979]">
              {item}
            </a>
          ))}
        </nav>

        <a
          href="#reserve"
          className="rounded-full border border-[#d8b268]/40 bg-[#d8b268]/12 px-5 py-3 text-sm font-semibold text-[#f8deb0] shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition hover:border-[#f0c879]/70 hover:bg-[#d8b268]/20"
        >
          Reserve
        </a>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-20 pt-10 sm:px-10 md:pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:px-12 lg:pb-28">
        <div>
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.34em] text-[#d6ad60]">
            Seasonal Thai Supper House
          </p>
          <h1 className="max-w-4xl font-serif text-6xl leading-[0.92] text-[#fff8e8] sm:text-7xl lg:text-8xl">
            A darker, richer table for modern Thai dining.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#d8ccb3]">
            Fire-roasted herbs, deep coconut broths, and gold-lit service shaped
            into an intimate evening menu.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#reserve"
              className="rounded-full bg-[#e5b764] px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[#122018] shadow-[0_22px_55px_rgba(229,183,100,0.22)] transition hover:bg-[#f2cc80]"
            >
              Book a table
            </a>
            <a
              href="#menu"
              className="rounded-full border border-[#f3dfb3]/20 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[#f8e5bb] transition hover:border-[#e5b764]/70 hover:bg-white/5"
            >
              View menu
            </a>
          </div>
        </div>

        <div className="relative min-h-[420px] lg:min-h-[640px]">
          <div className="absolute inset-x-8 bottom-8 top-10 rounded-full bg-[#d8b268]/12 blur-3xl" />
          <div className="absolute right-0 top-0 hidden h-40 w-40 rounded-full border border-[#d8b268]/30 lg:block" />
          <div className="relative z-10 mx-auto w-[82vw] max-w-[560px] rounded-[2rem] border border-[#d8b268]/28 bg-[#07150f] p-3 shadow-[0_36px_90px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.05)] sm:w-[68vw] lg:w-full lg:max-w-[640px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Dessert_for_Chef%27s_table%2C_Mainz.jpg/960px-Dessert_for_Chef%27s_table%2C_Mainz.jpg?_=20240624132741"
              alt="A plated fine-dining dessert with cream, fruit, and delicate garnish"
              width={960}
              height={640}
              loading="eager"
              className="aspect-[4/3] w-full rounded-[1.45rem] object-cover object-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
            />
          </div>
          <div className="absolute bottom-2 left-2 z-20 max-w-60 rounded-2xl border border-white/10 bg-[#092419]/82 p-5 shadow-2xl backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d6ad60]">
              Tonight
            </p>
            <p className="mt-2 font-serif text-2xl text-[#fff8e8]">
              Jasmine cream finale
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#092018]/72">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[0.72fr_1fr] lg:px-12">
          <div className="relative">
            <Image
              src="/landing-assets/side-dish.svg"
              alt="A small supporting Thai dish"
              width={520}
              height={420}
              className="w-full max-w-sm drop-shadow-[0_30px_42px_rgba(0,0,0,0.38)]"
            />
            <Image
              src="/landing-assets/fork.svg"
              alt=""
              aria-hidden="true"
              width={180}
              height={720}
              className="absolute -bottom-8 left-48 hidden h-44 rotate-12 opacity-75 sm:block"
            />
          </div>

          <div className="self-center">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d6ad60]">
              Rooted in craft
            </p>
            <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-tight text-[#fff8e8] sm:text-5xl">
              A quiet room, layered spice, and dishes paced like a story.
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#d8ccb3]">
              Each course starts with Thai market produce and finishes with a
              restrained, polished plate: smoky, herbal, bright, and deeply
              composed.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {["12-course tasting", "Open-fire kitchen", "Gold room service"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 text-sm font-semibold text-[#f5e4bf]"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d6ad60]">
              Signature plates
            </p>
            <h2 className="mt-5 font-serif text-4xl text-[#fff8e8] sm:text-5xl">
              The evening edit
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[#d8ccb3]">
            Three house favorites built for contrast: velvet heat, fragrant
            grains, and a clean garden finish.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {dishes.map((dish) => (
            <article
              key={dish.name}
              className="group rounded-[1.75rem] border border-white/10 bg-[#0b261c]/88 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:border-[#d8b268]/45 hover:bg-[#102d21]"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="rounded-full border border-[#d8b268]/30 bg-[#d8b268]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e9c984]">
                  {dish.accent}
                </span>
                <span className="size-3 rounded-full bg-[#e5b764] shadow-[0_0_22px_rgba(229,183,100,0.7)]" />
              </div>
              <h3 className="font-serif text-3xl text-[#fff8e8]">{dish.name}</h3>
              <p className="mt-5 leading-7 text-[#d8ccb3]">{dish.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="reserve" className="mx-auto max-w-7xl px-6 pb-10 sm:px-10 lg:px-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#d8b268]/22 bg-[#10271d] px-7 py-12 shadow-[0_30px_110px_rgba(0,0,0,0.35)] sm:px-12 lg:px-16">
          <Image
            src="/landing-assets/logo-mark.svg"
            alt=""
            aria-hidden="true"
            width={256}
            height={256}
            className="absolute right-8 top-8 h-28 w-28 opacity-15"
          />
          <div className="relative max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d6ad60]">
              Private table
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-[#fff8e8] sm:text-6xl">
              Reserve the green room for a candlelit Thai tasting.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d8ccb3]">
              Limited seats, composed pairings, and a menu that changes with the
              market.
            </p>
            <a
              href="mailto:hello@saffronandleaf.example"
              className="mt-9 inline-flex rounded-full bg-[#e5b764] px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#122018] transition hover:bg-[#f2cc80]"
            >
              Request a reservation
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-9 text-sm text-[#b9ad94] sm:px-10 md:flex-row md:items-center md:justify-between lg:px-12">
        <p>Saffron & Leaf, Bangkok</p>
        <p>Open Tuesday to Sunday, 6 PM to late</p>
      </footer>
    </main>
  );
}
