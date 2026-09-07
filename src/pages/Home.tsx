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
  mark: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663890199501/IOaaJgrMjOTsgTtg.png",
  pour: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663890199501/kgMofEYkZaiXdMoz.jpg",
  food: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663890199501/WHWcautirhsaTBxT.jpg",
  interior: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663890199501/aedIRbbuwjPIvZid.jpg",
  property: "/manus-storage/golden-pint-property-reference_258df23d.png",
};

const beers = [
  {
    number: "01",
    style: "German Pilsner",
    name: "Majestic Pils",
    abv: "4.8%",
    ibu: "16",
    note: "Bright, floral, and clean with a crisp finish that keeps the conversation moving.",
    color: "#dfa042",
  },
  {
    number: "02",
    style: "Japanese Lager",
    name: "Midnight Express",
    abv: "5.2%",
    ibu: "18",
    note: "Delicate rice sweetness, noble hops, and a dry, impossibly refreshing finish.",
    color: "#e8c27a",
  },
  {
    number: "03",
    style: "West Coast IPA",
    name: "Tropic Thunder",
    abv: "6.5%",
    ibu: "60",
    note: "Pine, grapefruit, and a soft tropical lift for the ones who like their pints loud.",
    color: "#c77a2e",
  },
  {
    number: "04",
    style: "Oatmeal Stout",
    name: "Velvet Night",
    abv: "5.6%",
    ibu: "28",
    note: "Roasted coffee, dark chocolate, and a satin-smooth body made for slow evenings.",
    color: "#54301a",
  },
];

const navItems = [
  ["Story", "story"],
  ["On tap", "on-tap"],
  ["Kitchen", "kitchen"],
  ["Menu", "menu"],
  ["Gallery", "gallery"],
  ["Corporate", "corporate"],
  ["About us", "about-us"],
  ["Visit", "visit"],
] as const;

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
  const [activeBeer, setActiveBeer] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
  }, []);

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

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const openBooking = () => {
    setBookingOpen(true);
    setMenuOpen(false);
    setSubmitted(false);
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
        <button type="button" className="nav-brand" onClick={() => jumpTo("top")} aria-label="Back to top">
          <Wordmark />
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, id]) => (
            <button type="button" key={id} onClick={() => jumpTo(id)}>{label}</button>
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
            {navItems.map(([label, id], index) => (
              <button type="button" key={id} onClick={() => jumpTo(id)}>
                <span>0{index + 1}</span>{label}<ArrowUpRight size={20} />
              </button>
            ))}
          </div>
          <div className="mobile-menu__footer">
            <p>Fresh off the brass.<br />Five minutes from the station.</p>
            <button type="button" className="button button--amber" onClick={openBooking}>Reserve a table <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      <main id="main-content">
        <section id="top" className="hero-section">
          <div className="hero-image" style={{ backgroundImage: `url(${assets.hero})` }} />
          <div className="hero-overlay" />
          <div className="hero-beam" />
          <div className="hero-content page-pad">
            <div className="eyebrow eyebrow--light"><span className="eyebrow__line" />Craft beer and kitchen</div>
            <h1 className="hero-title">Brewed for the <em>city in motion.</em></h1>
            <p className="hero-dek">Craft beer, a proper kitchen, and late evenings in the heart of Majestic.</p>
            <div className="hero-actions">
              <button type="button" className="button button--amber" onClick={() => jumpTo("on-tap")}>See what is pouring <ArrowUpRight size={16} /></button>
              <button type="button" className="button button--ghost" onClick={openBooking}>Reserve a table <ArrowUpRight size={16} /></button>
            </div>
            <div className="hero-footnotes"><span>21+ only</span><span>Five minutes from the station</span><span>Fresh beer and good food</span></div>
          </div>
          <div className="hero-side-note"><span className="hero-side-note__dot" />Open today <strong>12 PM to 1 AM</strong></div>
          <div className="hero-scroll"><span>Scroll to explore</span><ArrowDownRight size={18} /></div>
        </section>

        <section className="visit-bar page-pad" aria-label="Plan your visit">
          <div className="visit-bar__item"><Clock3 size={17} strokeWidth={1.6} /><div><small>Open today</small><strong>12 PM to 1 AM</strong></div></div>
          <div className="visit-bar__item"><TrainFront size={17} strokeWidth={1.6} /><div><small>Find us</small><strong>Five minutes from Majestic</strong></div></div>
          <button type="button" className="visit-bar__action" onClick={openBooking}><CalendarDays size={17} strokeWidth={1.6} /><span>Plan your table</span><ArrowUpRight size={16} /></button>
        </section>

        <div className="ticker" aria-label="Brewery highlights">
          <div className="ticker__track" aria-hidden="true">Craft <i>✦</i> Beer <i>✦</i> Food <i>✦</i> Good times <i>✦</i> Bengaluru <i>✦</i> Craft <i>✦</i> Beer <i>✦</i> Food <i>✦</i> Good times <i>✦</i> Bengaluru <i>✦</i></div>
        </div>

        <section id="story" className="story-section page-pad section-pad">
          <div className="section-kicker">01 / The V6 Brewski story</div>
          <div className="route-trace route-trace--story" aria-hidden="true"><span>Majestic / 01</span><i /><span>Arrival</span></div>
          <div className="story-grid">
            <div className="story-heading" data-reveal="fade-up"><h2>Brewed in the <span>middle</span><br /> of it.</h2><div className="story-stamp">Brewed<br />in the<br /><strong>heart</strong><br />of it.</div></div>
            <div className="story-photo-wrap"><div className="photo-index">01  The room</div><img src={assets.property} alt="Warm timber brewery interior with woven pendant lamps and a glowing bar" className="story-photo" /><div className="photo-caption">The light, timber, and brass that set the house tone.</div></div>
            <div className="story-copy"><p className="lead-copy">Majestic is where Bengaluru crosses paths. V6 Brewski is the pause between places, poured for the first cold sip after a long commute.</p><p>Our beers are brewed in small batches, on site, with a kitchen that keeps the table moving.</p><button type="button" className="text-link" onClick={() => toast("The V6 Brewski story is being brewed one batch at a time.")}>Read our story <ArrowUpRight size={15} /></button></div>
          </div>
        </section>

        <section id="on-tap" className="tap-section section-pad page-pad">
          <div className="tap-header" data-reveal="fade-up"><div><div className="section-kicker section-kicker--light">02 / What is pouring</div><h2>Fresh off<br /><em>the brass.</em></h2></div><p className="tap-intro">Four house pours, brewed here and tuned for the city. Open a row for style, strength, and the best plate to pair with it.</p></div>
          <div className="route-trace route-trace--tap" aria-hidden="true"><span>02</span><i /><span>Fresh pours  platform side</span></div>
          <div className="beer-list" role="list">
            {beers.map((beer, index) => {
              const isActive = index === activeBeer;
              return (
                <div className={`beer-row ${isActive ? "beer-row--active" : ""}`} key={beer.name} role="listitem" data-reveal="fade-up" style={{ "--reveal-delay": `${index * 75}ms` } as React.CSSProperties}>
                  <button type="button" className="beer-row__button" onClick={() => setActiveBeer(isActive ? -1 : index)} aria-expanded={isActive} aria-controls={`beer-detail-${index}`}>
                    <span className="beer-number">{beer.number}</span>
                    <span className="beer-meta"><small>{beer.style}</small><strong>{beer.name}</strong></span>
                    <span className="beer-stats"><small>ABV</small>{beer.abv}<i>·</i><small>IBU</small>{beer.ibu}</span>
                    <span className="beer-arrow"><ChevronDown size={18} /></span>
                  </button>
                  {isActive && <div className="beer-detail" id={`beer-detail-${index}`}><div className="beer-glass" style={{ "--beer-color": beer.color } as React.CSSProperties}><div className="beer-glass__foam" /><div className="beer-glass__liquid" /><div className="beer-glass__shine" /></div><div className="beer-detail__copy"><div className="detail-label">House pour · 330 ml</div><p>{beer.note}</p><div className="detail-pair"><span>Pairs with</span><strong>{index === 3 ? "Dark chocolate dessert" : index === 2 ? "Spiced wings & fries" : "Smoked starters"}</strong></div></div></div>}
                </div>
              );
            })}
          </div>
          <div className="tap-footer"><span>More pours rotate weekly</span><button type="button" className="text-link text-link--light" onClick={() => toast("Ask the bar team what is rotating this week.")}>View the full tap list <ArrowUpRight size={15} /></button></div>
        </section>

        <section id="kitchen" className="kitchen-section section-pad">
          <div className="page-pad kitchen-grid"><div className="kitchen-copy" data-reveal="fade-up"><div className="section-kicker">03 / The kitchen</div><h2>A table for<br /><em>the whole night.</em></h2><p>Big flavours, honest ingredients, and plates designed for the middle of the table. Bengaluru comfort with a brewery appetite.</p><button type="button" className="button button--dark" onClick={() => toast("Tonight's menu is available at the bar.")}>Open the menu <ArrowUpRight size={16} /></button></div><div className="kitchen-photo-wrap" data-reveal="scale-in" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}><img src={assets.food} alt="Shared craft dining dishes on a dark table" className="kitchen-photo" /><div className="kitchen-note"><span>Tonight's table</span><strong>Smoke  spice<br />and a cold one.</strong></div></div></div>
        </section>

        <section id="menu" className="menu-section section-pad page-pad">
          <div className="menu-section__head" data-reveal="fade-up"><div><div className="section-kicker">04 / The menu</div><h2>Good food.<br /><em>No ceremony.</em></h2></div><p>Shareable plates, smoky edges, and enough room on the table for another pint.</p></div>
          <div className="menu-highlights" role="list">
            {menuHighlights.map(([label, description], index) => <div className="menu-highlight" role="listitem" key={label}><span>0{index + 1}</span><div><strong>{label}</strong><p>{description}</p></div><ArrowUpRight size={17} /></div>)}
          </div>
          <button type="button" className="button button--dark" onClick={() => toast("The full menu is available at the bar.")}>View the full menu <ArrowUpRight size={16} /></button>
        </section>

        <section id="gallery" className="gallery-section section-pad page-pad">
          <div className="gallery-section__head" data-reveal="fade-up"><div><div className="section-kicker section-kicker--light">05 / The gallery</div><h2>See the<br /><em>house glow.</em></h2></div><p>Woven light, warm pours, and a room built for lingering.</p></div>
          <div className="gallery-grid">
            {galleryItems.map((item, index) => <figure className={`gallery-card gallery-card--${index + 1}`} key={item.label} data-reveal="scale-in" style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}><img src={item.image} alt={item.title} /><figcaption><span>{item.label}</span><strong>{item.title}</strong></figcaption></figure>)}
          </div>
        </section>

        <section id="corporate" className="corporate-section section-pad page-pad">
          <div className="corporate-grid">
            <div className="corporate-copy" data-reveal="fade-up"><div className="section-kicker">06 / Corporate tables</div><h2>Bring the<br /><em>whole room.</em></h2><p>Team dinners, offsites, launches, and the kind of meetings that deserve a better table. We make room for groups with good taste and a little time.</p><button type="button" className="button button--dark" onClick={() => toast("Corporate enquiries are ready to connect to your events partner.")}>Plan a group evening <ArrowUpRight size={16} /></button></div>
            <div className="corporate-card" data-reveal="scale-in"><img src={assets.interior} alt="V6 Brewski bar interior prepared for a group evening" /><div><span>Group dining / Majestic</span><strong>One table.<br />Many reasons.</strong></div></div>
          </div>
        </section>

        <section id="about-us" className="about-section section-pad page-pad">
          <div className="about-section__head" data-reveal="fade-up"><div className="section-kicker section-kicker--light">07 / About V6 Brewski</div><h2>Made here.<br /><em>For here.</em></h2></div>
          <div className="about-section__body"><p className="lead-copy">V6 Brewski is a Majestic microbrewery and kitchen built around the pause between places.</p><div><p>We brew in small batches, cook for the middle of the table, and leave enough space for the evening to become its own plan.</p><button type="button" className="text-link text-link--light" onClick={() => toast("The V6 Brewski story is being brewed one batch at a time.")}>Our brewing notes <ArrowUpRight size={15} /></button></div></div>
        </section>

        <section id="visit" className="visit-section visit-section--journey section-pad page-pad">
          <div className="journey-head" data-reveal>
            <div>
              <div className="section-kicker">08 / Find us</div>
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

        <footer className="site-footer page-pad"><div className="footer-main"><Wordmark /><div className="footer-line">Brewed. Poured. Lived.<br /><em>Majestically.</em></div><div className="footer-social"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="V6 Brewski Brewery on Instagram"><Instagram size={19} /></a><a href="#visit" aria-label="Find V6 Brewski Brewery" onClick={(event) => { event.preventDefault(); jumpTo("visit") }}><MapPin size={19} /></a></div></div><div className="footer-bottom"><span>© 2026 V6 Brewski Brewery. All rights reserved.</span><span>21+ only  Drink responsibly</span><span>Majestic Bengaluru</span></div></footer>
      </main>

      {bookingOpen && <div className="booking-backdrop" role="presentation" onClick={() => setBookingOpen(false)}><aside className="booking-panel" role="dialog" aria-modal="true" aria-labelledby="booking-title" onClick={(event) => event.stopPropagation()}><button type="button" className="booking-close" onClick={() => setBookingOpen(false)} aria-label="Close booking"><X size={20} /></button>{submitted ? <div className="booking-success"><div className="success-mark"><Check size={22} /></div><div className="section-kicker">Request received</div><h2 id="booking-title">Your table<br /><em>is on the way.</em></h2><p>Your reservation details are ready for handoff to the booking partner.</p><button type="button" className="button button--amber" onClick={() => setBookingOpen(false)}>Back to the site <ArrowRight size={16} /></button></div> : <><div className="section-kicker">A seat at the bar</div><h2 id="booking-title">Save your<br /><em>golden hour.</em></h2><p className="booking-intro">Tell us when you are arriving and we will hold the good table.</p><form onSubmit={submitBooking}><label htmlFor="booking-name">Name<input id="booking-name" name="name" autoComplete="name" required placeholder="Your name" /></label><div className="form-row"><label htmlFor="booking-date">Date<input id="booking-date" name="date" required type="date" /></label><label htmlFor="booking-guests">Guests<select id="booking-guests" name="guests" defaultValue="2"><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="5">5 or more guests</option></select></label></div><label htmlFor="booking-phone">Mobile number<input id="booking-phone" name="phone" autoComplete="tel" required type="tel" placeholder="+91" /></label><button className="button button--amber button--wide" type="submit">Request a table <ArrowUpRight size={16} /></button></form><p className="booking-footnote"><CalendarDays size={14} /> Tuesday to Sunday 12 PM to 1 AM</p></>}</aside></div>}
    </div>
  );
}
