/*
  STYLE REMINDER — V6 Brewski Timber House.
  Warm timber hospitality for Majestic: deep walnut, honey wood, golden-wood light,
  framed editorial photography, offset layouts, and tactile motion.
  Keep the graphic language confident and material rather than flat brown.
*/
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Footprints,
  Instagram,
  MapPin,
  Menu,
  PersonStanding,
  TrainFront,
  X,
} from "lucide-react";
import { toast } from "sonner";

const assets = {
  hero: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663890199501/tgCbAxodNakGJDLG.jpg",
  mark: "/v6-logo.webp",
  pour: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663890199501/kgMofEYkZaiXdMoz.jpg",
  food: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663890199501/WHWcautirhsaTBxT.jpg",
  interior: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663890199501/aedIRbbuwjPIvZid.jpg",
  property: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663890199501/aedIRbbuwjPIvZid.jpg",
};

const beers = [
  {
    number: "06-01",
    style: "House Lager",
    name: "Majestic Lager",
    abv: "4.5%",
    ibu: "18",
    status: "live",
    statusLabel: "Live",
    note: "Bright, clean, and crisp with a finish built for the first pour of the evening.",
    pair: "Smoked starters",
    color: "#E6B92C",
  },
  {
    number: "06-02",
    style: "Wheat Beer",
    name: "Hefeweizen",
    abv: "4.0%",
    ibu: "12",
    status: "live",
    statusLabel: "Live",
    note: "Soft wheat, gentle fruit, and a rounded finish made for an easy second round.",
    pair: "Grilled plates",
    color: "#A65F2C",
  },
  {
    number: "06-03",
    style: "India Pale Ale",
    name: "West Coast IPA",
    abv: "6.2%",
    ibu: "45",
    status: "next",
    statusLabel: "Next",
    note: "Citrus, pine, and a clean bitter edge with a bright aromatic lift.",
    pair: "Spiced wings & fries",
    color: "#E4574F",
  },
  {
    number: "06-04",
    style: "Stout",
    name: "Dark Stout",
    abv: "5.5%",
    ibu: "32",
    status: "sold",
    statusLabel: "Sold out",
    note: "Roasted malt, dark chocolate, and a smooth body for a slower pour.",
    pair: "Dark chocolate dessert",
    color: "#3A251D",
  },
  {
    number: "06-05",
    style: "Rotating Tap",
    name: "Seasonal Brew",
    abv: "5.2%",
    ibu: "24",
    status: "sold",
    statusLabel: "Sold out",
    note: "A rotating house brew that changes with the season and the brewer's board.",
    pair: "Ask the kitchen",
    color: "#31543A",
  },
];

const navItems = [
  ["Home", "home"],
  ["Menu", "menu"],
  ["Gallery", "gallery"],
  ["Corporate", "corporate"],
  ["About us", "about-us"],
  ["Visit", "visit"],
] as const;

const homeSectionIds = new Set(["story", "on-tap", "kitchen"]);
const pageIds = ["menu", "gallery", "corporate", "about-us", "visit"] as const;

const galleryItems = [
  { label: "The room", title: "Light over timber", image: assets.property },
  { label: "The pour", title: "Cold, bright, precise", image: assets.pour },
  { label: "The kitchen", title: "Plates for the middle", image: assets.food },
  { label: "The bar", title: "Stay for another", image: assets.interior },
];

const menuHighlights = [
  ["Small plates", "Charred, crisp, made for sharing"],
  ["Mains", "Bengaluru comfort with a brewery appetite"],
  ["Something sweet", "Dark chocolate, malt, and one last pour"],
] as const;

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`wordmark ${compact ? "wordmark--compact" : ""}`}>
      <img src={assets.mark} alt="" className="wordmark__mark" />
      <div>
        <div className="wordmark__name">V6 Brewski</div>
        <div className="wordmark__sub">Majestic Bengaluru</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeBeer, setActiveBeer] = useState(-1);
  const [submitted, setSubmitted] = useState(false);
  const [guestOption, setGuestOption] = useState("2");
  const [path, setPath] = useState(() => window.location.pathname || "/");

  const normalizedPath = path.replace(/\/+$/, "") || "/";
  const knownPaths = new Set(["/", ...pageIds.map((id) => "/" + id)]);
  const currentPath = knownPaths.has(normalizedPath) ? normalizedPath : "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || "/");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (["/story", "/on-tap", "/kitchen"].includes(normalizedPath)) {
      window.history.replaceState({}, "", "/");
      setPath("/");
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentPath, normalizedPath]);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [currentPath]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (bookingOpen) setBookingOpen(false);
      if (menuOpen) setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    if (bookingOpen || menuOpen) document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [bookingOpen, menuOpen]);

  const navigate = (nextPath: string) => {
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setPath(nextPath);
    setMenuOpen(false);
  };

  const navigateToSection = (id: string) => {
    if (id === "home") {
      navigate("/");
      return;
    }

    if (!homeSectionIds.has(id)) {
      navigate("/" + id);
      return;
    }

    const scrollToSection = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (currentPath !== "/") {
      if (window.location.pathname !== "/") {
        window.history.pushState({}, "", "/");
      }
      setPath("/");
      setMenuOpen(false);
      window.setTimeout(scrollToSection, 80);
      return;
    }

    setMenuOpen(false);
    scrollToSection();
  };

  const openBooking = () => {
    setBookingOpen(true);
    setMenuOpen(false);
    setSubmitted(false);
    setGuestOption("2");
  };

  const submitBooking = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    toast.success("Request ready for handoff", {
      description: "Your reservation details are ready to connect to the booking partner.",
    });
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="grain" aria-hidden="true" />

      <header className={`site-nav ${scrolled ? "site-nav--scrolled" : ""}`}>
        <button type="button" className="nav-brand" onClick={() => navigate("/")} aria-label="Back to top">
          <Wordmark />
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, id]) => (
            <button
              type="button"
              key={id}
              className={id === "home" ? (currentPath === "/" ? "is-active" : "") : (!homeSectionIds.has(id) && currentPath === "/" + id ? "is-active" : "")}
              onClick={() => navigateToSection(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="nav-location"><MapPin size={14} strokeWidth={1.8} /><span>Majestic Bengaluru</span></div>
        <button type="button" className="nav-book" onClick={openBooking}>
          Book a table <ArrowUpRight size={15} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          className="menu-trigger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="mobile-menu__top"><Wordmark compact /><span>Navigation</span></div>
          <div className="mobile-menu__links">
            {navItems.map(([label, id]) => (
              <button
                type="button"
                key={id}
                className={!homeSectionIds.has(id) && currentPath === "/" + id ? "is-active" : ""}
                onClick={() => navigateToSection(id)}
              >
                {label}<ArrowUpRight size={20} />
              </button>
            ))}
          </div>
          <div className="mobile-menu__footer">
            <p>Platform 06 / Majestic<br />V6 Route · Live</p>
            <button type="button" className="button button--amber" onClick={openBooking}>Reserve a table <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      <main id="main-content">
        {currentPath === "/" && (
          <>
        <section id="top" className="hero-section">
          <div className="hero-image" style={{ backgroundImage: `url(${assets.hero})` }} />
          <div className="hero-overlay" />
          <div className="hero-beam" />
          <div className="hero-content page-pad">
            <div className="eyebrow eyebrow--light"><span className="eyebrow__line" />Platform 06 · Majestic</div>
            <h1 className="hero-title">Brewed for the <em>city in motion.</em></h1>
            <p className="hero-dek">V6 Brewski — bold brews, a proper kitchen, and late evenings at the Majestic exchange.</p>
            <div className="hero-actions">
              <button type="button" className="button button--amber" onClick={() => navigateToSection("on-tap")}>Now pouring <ArrowUpRight size={16} /></button>
              <button type="button" className="button button--ghost" onClick={openBooking}>Reserve a table <ArrowUpRight size={16} /></button>
            </div>
            <div className="hero-footnotes"><span>21+ only</span><span>Five minutes from the station</span><span>Fresh beer and good food</span></div>
          </div>
          <div className="hero-side-note"><span className="hero-side-note__dot" />Next brew <strong>20:45</strong></div>
          <div className="hero-scroll"><span>Scroll to explore</span><ArrowDownRight size={18} /></div>
        </section>

        <section className="brand-board page-pad" aria-label="V6 Brewski route board">
          <div className="brand-board__tile brand-board__tile--platform"><small>Platform</small><strong>06</strong></div>
          <div className="brand-board__tile"><small>Route</small><strong>V6-01</strong></div>
          <div className="brand-board__tile brand-board__tile--destination"><small>Destination</small><strong>Majestic → V6 Brewski</strong></div>
          <div className="brand-board__tile brand-board__tile--live"><small>Arrival</small><strong><span className="status-dot status-dot--live" /> Live</strong></div>
        </section>

        <section className="visit-bar page-pad" aria-label="Plan your visit">
          <div className="visit-bar__item"><Clock3 size={17} strokeWidth={1.6} /><div><small>Open today</small><strong>12 PM to 1 AM</strong></div></div>
          <div className="visit-bar__item"><TrainFront size={17} strokeWidth={1.6} /><div><small>Find us</small><strong>Five minutes from Majestic</strong></div></div>
          <button type="button" className="visit-bar__action" onClick={openBooking}><CalendarDays size={17} strokeWidth={1.6} /><span>Plan your table</span><ArrowUpRight size={16} /></button>
        </section>

        <div className="ticker" aria-label="Brewery highlights">
          <div className="ticker__track" aria-hidden="true">PLATFORM 06 <i>→</i> NOW POURING <i>→</i> ROUTE V6-01 <i>→</i> DESTINATION MAJESTIC <i>→</i> ARRIVAL <i>●</i> LIVE <i>→</i> PLATFORM 06 <i>→</i> NOW POURING <i>→</i> ROUTE V6-01 <i>→</i> DESTINATION MAJESTIC <i>→</i> ARRIVAL <i>●</i> LIVE <i>→</i></div>
        </div>

        <section id="story" className="story-section page-pad section-pad">
          <div className="section-kicker">The V6 Brewski story</div>
          <div className="route-trace route-trace--story" aria-hidden="true"><span>Majestic</span><i /><span>V6 Brewski</span></div>
          <div className="story-grid">
            <div className="story-heading" data-reveal="fade-up"><h2>Brewed in the <span>middle</span><br /> of it.</h2><div className="story-stamp">V6<br />Brewski<br /><strong>06</strong><br />Platform</div></div>
            <div className="story-photo-wrap"><div className="photo-index">The room</div><img src={assets.property} alt="Warm timber brewery interior with woven pendant lamps and a glowing bar" className="story-photo" /><div className="photo-caption">The light, timber, and brass that set the house tone.</div></div>
            <div className="story-copy"><p className="lead-copy">Majestic is where Bengaluru crosses paths. V6 Brewski is the pause between places, poured for the first cold sip after a long commute.</p><p>Our beers are brewed in small batches, on site, with a kitchen that keeps the table moving.</p><button type="button" className="text-link" onClick={() => toast("The V6 Brewski story is being brewed one batch at a time.")}>Read our story <ArrowUpRight size={15} /></button></div>
          </div>
        </section>

        <section id="on-tap" className="tap-section section-pad page-pad">
          <div className="tap-header" data-reveal="fade-up"><div><div className="section-kicker section-kicker--light">Now pouring</div><h2>Fresh off<br /><em>the brass.</em></h2></div><p className="tap-intro">Route, brew, ABV, IBU and live status — the V6 platform board for today's house pours.</p></div>
          <div className="tap-status-strip" aria-label="Tap board status">
            <div className="tap-status-strip__item tap-status-strip__item--platform"><small>Platform</small><strong>06</strong></div>
            <div className="tap-status-strip__item tap-status-strip__item--route"><small>Route</small><strong>V6-01 · Majestic</strong></div>
            <div className="tap-status-strip__item tap-status-strip__item--next"><small>Next brew</small><strong>20:45</strong></div>
            <div className="tap-status-strip__item tap-status-strip__item--last"><small>Last call</small><strong>22:45</strong></div>
          </div>
          <div className="beer-list" role="list">
            {beers.map((beer, index) => {
              const isActive = index === activeBeer;
              return (
                <div className={`beer-row ${isActive ? "beer-row--active" : ""}`} key={beer.name} role="listitem">
                  <button type="button" className="beer-row__button" onClick={() => setActiveBeer(isActive ? -1 : index)} aria-expanded={isActive} aria-controls={`beer-detail-${index}`}>
                    <span className="beer-number">{beer.number}</span>
                    <span className="beer-meta"><small>{beer.style}</small><strong>{beer.name}</strong></span>
                    <span className="beer-stats"><small>ABV</small>{beer.abv}<i>·</i><small>IBU</small>{beer.ibu}</span>
                    <span className={`beer-status beer-status--${beer.status}`}><span className={`status-dot status-dot--${beer.status}`} />{beer.statusLabel}</span>
                    <span className="beer-arrow"><ChevronDown size={18} /></span>
                  </button>
                  {isActive && (
                    <div className="beer-detail beer-detail--compact" id={`beer-detail-${index}`}>
                      <div className="beer-detail__accent" style={{ "--beer-color": beer.color } as React.CSSProperties}>
                        <span className="beer-detail__route">{beer.number}</span>
                        <span className="beer-detail__swatch" />
                      </div>
                      <div className="beer-detail__copy">
                        <div className="detail-label">House pour · 330 ml</div>
                        <p>{beer.note}</p>
                        <div className="beer-detail__facts">
                          <div><span>ABV</span><strong>{beer.abv}</strong></div>
                          <div><span>IBU</span><strong>{beer.ibu}</strong></div>
                          <div><span>Pairs with</span><strong>{beer.pair}</strong></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="tap-footer"><span>Route board updates with every rotating tap</span><button type="button" className="text-link text-link--light" onClick={() => toast("Ask the bar team what is rotating this week.")}>View the full tap list <ArrowUpRight size={15} /></button></div>
        </section>

        <section id="kitchen" className="kitchen-section section-pad">
          <div className="page-pad kitchen-grid"><div className="kitchen-copy" data-reveal="fade-up"><div className="section-kicker">Destination / The kitchen</div><h2>A table for<br /><em>the whole night.</em></h2><p>Big flavours, honest ingredients, and plates designed for the middle of the table. Bengaluru comfort with a brewery appetite.</p><button type="button" className="button button--dark" onClick={() => navigate("/menu")}>Open the menu <ArrowUpRight size={16} /></button></div><div className="kitchen-photo-wrap" data-reveal="scale-in" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}><img src={assets.food} alt="Shared craft dining dishes on a dark table" className="kitchen-photo" /><div className="kitchen-note"><span>Tonight's table</span><strong>Smoke  spice<br />and a cold one.</strong></div></div></div>
        </section>
          </>
        )}

        {currentPath === "/menu" && (
        <section id="menu" className="menu-section section-pad page-pad standalone-section">
          <div className="menu-section__head" data-reveal="fade-up">
            <div>
              <div className="section-kicker">Platform 06 / The menu</div>
              <h2>Good food.<br /><em>NO CEREMONY.</em></h2>
            </div>
            <aside className="menu-section__intro">
              <span>The table / Majestic</span>
              <p>Shareable plates, smoky edges, and enough room on the table for another pint.</p>
              <strong>Kitchen open · 12 PM to late</strong>
            </aside>
          </div>
          <div className="menu-highlights" role="list">
            {menuHighlights.map(([label, description], index) => <div className="menu-highlight" role="listitem" key={label}><span>0{index + 1}</span><div><strong>{label}</strong><p>{description}</p></div><ArrowUpRight size={17} /></div>)}
          </div>
          <button type="button" className="button button--dark" onClick={() => toast("The full menu is available at the bar.")}>View the full menu <ArrowUpRight size={16} /></button>
        </section>
        )}

        {currentPath === "/gallery" && (
        <section id="gallery" className="gallery-section section-pad page-pad standalone-section">
          <div className="gallery-section__head" data-reveal="fade-up"><div><div className="section-kicker section-kicker--light">Mood & feel / The gallery</div><h2>See the<br /><em>house glow.</em></h2></div><p>Woven light, warm pours, and a room built for lingering.</p></div>
          <div className="gallery-grid">
            {galleryItems.map((item, index) => <figure className={`gallery-card gallery-card--${index + 1}`} key={item.label} data-reveal="scale-in" style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}><img src={item.image} alt={item.title} /><figcaption><span>{item.label}</span><strong>{item.title}</strong></figcaption></figure>)}
          </div>
        </section>
        )}

        {currentPath === "/corporate" && (
        <section id="corporate" className="corporate-section section-pad page-pad standalone-section">
          <div className="corporate-grid">
            <div className="corporate-copy" data-reveal="fade-up"><div className="section-kicker">Route / Corporate tables</div><h2>Bring the<br /><em>whole room.</em></h2><p>Team dinners, offsites, launches, and the kind of meetings that deserve a better table. We make room for groups with good taste and a little time.</p><button type="button" className="button button--dark" onClick={() => toast("Corporate enquiries are ready to connect to your events partner.")}>Plan a group evening <ArrowUpRight size={16} /></button></div>
            <div className="corporate-card" data-reveal="scale-in"><img src={assets.interior} alt="V6 Brewski bar interior prepared for a group evening" /><div><span>Group dining / Majestic</span><strong>One table.<br />Many reasons.</strong></div></div>
          </div>
        </section>
        )}

        {currentPath === "/about-us" && (
        <section id="about-us" className="about-section section-pad page-pad standalone-section">
          <div className="about-section__hero" data-reveal="fade-up">
            <div className="about-section__head">
              <div className="section-kicker section-kicker--light">Brand / About V6 Brewski</div>
              <h2>Made here.<br /><em>For here.</em></h2>
            </div>
            <aside className="about-section__intro-card">
              <div className="about-section__mark-wrap"><img src={assets.mark} alt="V6 Brewski The Exchange emblem" /></div>
              <div>
                <span className="about-section__eyebrow">The Exchange · Majestic</span>
                <p>We brew in small batches, cook for the middle of the table, and make room for the evening to become its own plan.</p>
                <button type="button" className="about-cta" onClick={() => toast("The V6 Brewski story is being brewed one batch at a time.")}>Our brewing notes <ArrowUpRight size={15} /></button>
              </div>
            </aside>
          </div>
          <div className="about-section__body">
            <p className="lead-copy">V6 Brewski is a Majestic microbrewery and kitchen built around the pause between places.</p>
            <div className="about-section__detail">
              <span>Beer · Kitchen · The Exchange</span>
              <p>Rooted in Majestic, the house brings brewing, food and the energy of Bengaluru into one warm stop before or after the journey.</p>
            </div>
          </div>
        </section>
        )}

        {currentPath === "/visit" && (
        <section id="visit" className="visit-section visit-section--journey section-pad page-pad standalone-section">
          <div className="journey-head" data-reveal>
            <div>
              <div className="section-kicker">Destination / Find us</div>
              <h2><span>Find us in</span><em>Majestic.</em></h2>
            </div>
            <p>Five minutes from Majestic station.<br />Stay for one round or the whole night.</p>
          </div>

          <div className="journey-grid" data-reveal="scale-in" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <div className="journey-map" role="img" aria-label="Stylised route from Majestic station to V6 Brewski Brewery in Bengaluru">
              <div className="journey-map__wash" aria-hidden="true" />
              <div className="journey-map__grid" aria-hidden="true" />
              <div className="journey-map__topline"><span>Walk this way</span><strong><Footprints size={13} /> 05 min / on foot</strong></div>
              <div className="journey-map__north" aria-hidden="true"><span>N</span><ArrowUpRight size={13} /></div>
              <svg className="journey-map__route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path className="journey-map__route-shadow" d="M11 67 C25 60 34 65 48 56 S73 39 91 42" />
                <path className="journey-map__route-dash" d="M11 67 C25 60 34 65 48 56 S73 39 91 42" />
              </svg>
              <div className="journey-map__traveller" aria-hidden="true"><span className="journey-map__traveller-halo" /><PersonStanding size={23} strokeWidth={1.8} /><span className="journey-map__traveller-label">You are here</span></div>
              <div className="journey-stop journey-stop--start"><span className="journey-stop__dot" /><span className="journey-stop__label">Majestic<br /><small>Station</small></span></div>
              <div className="journey-stop journey-stop--active"><span className="journey-stop__dot"><MapPin size={13} /></span><span className="journey-stop__label">V6 Brewski<br /><small>Five min walk</small></span></div>
              <div className="journey-stop journey-stop--end"><span className="journey-stop__dot" /><span className="journey-stop__label">Bengaluru<br /><small>City centre</small></span></div>
              <div className="journey-map__step journey-map__step--one"><span>01</span><strong>Station exit</strong></div>
              <div className="journey-map__step journey-map__step--two"><span>02</span><strong>Golden hour</strong></div>
              <div className="journey-map__route">Kempegowda Road / Majestic</div>
              <p className="journey-map__note">A short walk from the station.</p>
            </div>

            <aside className="journey-panel">
              <div className="journey-panel__kicker">Plan the night</div>
              <h3><span>Five minutes</span><span>from the station.</span></h3>
              <p>Short route. Long evening.</p>
              <div className="journey-facts">
                <div><span>Neighbourhood</span><strong>Majestic, Bengaluru</strong></div>
                <div><span>Format</span><strong>Microbrewery + kitchen</strong></div>
                <div><span>Hours</span><strong>Tuesday to Sunday / 12 PM to 1 AM</strong></div>
              </div>
              <div className="journey-actions">
                <button type="button" className="button button--amber button--wide" onClick={openBooking}>Reserve a table <ArrowUpRight size={16} /></button>
                <a className="directions-link" href="https://maps.google.com/?q=V6+Brewski+Brewery+Majestic+Bengaluru" target="_blank" rel="noreferrer">Get directions <ArrowRight size={15} /></a>
              </div>
            </aside>
          </div>
        </section>
        )}

        <footer className="site-footer page-pad"><div className="footer-main"><Wordmark /><div className="footer-line">Brewed. Poured. Lived.<br /><em>Majestically.</em></div><div className="footer-social"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="V6 Brewski Brewery on Instagram"><Instagram size={19} /></a><a href="/visit" aria-label="Find V6 Brewski Brewery" onClick={(event) => { event.preventDefault(); navigate("/visit") }}><MapPin size={19} /></a></div></div><div className="footer-bottom"><span>© 2026 V6 Brewski Brewery. All rights reserved.</span><span>21+ only  Drink responsibly</span><span>Majestic Bengaluru</span></div></footer>
      </main>

      {bookingOpen && <div className="booking-backdrop" role="presentation" onClick={() => setBookingOpen(false)}><aside className="booking-panel" role="dialog" aria-modal="true" aria-labelledby="booking-title" onClick={(event) => event.stopPropagation()}><button type="button" className="booking-close" onClick={() => setBookingOpen(false)} aria-label="Close booking"><X size={20} /></button>{submitted ? <div className="booking-success"><div className="success-mark"><Check size={22} /></div><div className="section-kicker">Reservation received</div><h2 id="booking-title">Arrival<br /><em>confirmed.</em></h2><p>Your table request has been captured and is ready for confirmation.</p><button type="button" className="button button--amber" onClick={() => setBookingOpen(false)}>Back to the site <ArrowRight size={16} /></button></div> : <><div className="section-kicker">Platform 06 / Reservations</div><h2 id="booking-title">Reserve<br /><em>your table.</em></h2><p className="booking-intro">Choose your date, guest count and contact details. We’ll hold the table for your arrival.</p><form onSubmit={submitBooking}><label htmlFor="booking-name">Name<input id="booking-name" name="name" autoComplete="name" required placeholder="Your name" /></label><label htmlFor="booking-email">Email<input id="booking-email" name="email" autoComplete="email" required type="email" placeholder="you@example.com" /></label><div className="form-row"><label htmlFor="booking-date">Date<input id="booking-date" name="date" required type="date" /></label><label htmlFor="booking-guests">Guests<select id="booking-guests" name="guests" value={guestOption} onChange={(event) => setGuestOption(event.target.value)}><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="5">5 or more guests</option><option value="custom">Custom</option></select></label></div>{guestOption === "custom" && <label htmlFor="booking-custom-guests">Custom guest count<input id="booking-custom-guests" name="customGuests" required type="number" min="1" max="50" inputMode="numeric" placeholder="Enter number of guests" /></label>}<label htmlFor="booking-phone">Mobile number<input id="booking-phone" name="phone" autoComplete="tel" required type="tel" placeholder="+91" /></label><button className="button button--amber button--wide" type="submit">Request a table <ArrowUpRight size={16} /></button></form><p className="booking-footnote"><CalendarDays size={14} /> Tuesday to Sunday 12 PM to 1 AM</p></>}</aside></div>}
    </div>
  );
}
