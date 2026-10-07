const WHATSAPP = "https://wa.me/237694635250";
const PHONE = "tel:+237694635250";
const MAIL = "mailto:contact@groupe-kalao.com";

export default function HomePage() {
  return (
    <>
      <header className="top">
        <a className="brand" href="#accueil">
          <img src="/kalao-logo.png" alt="Groupe Kalao" />
          <span>Voyages</span>
        </a>
        <nav className="nav">
          <a className="hide-sm" href="#offres">
            Offres
          </a>
          <a className="hide-sm" href="#bureau">
            Bureau
          </a>
          <a className="btn btn-gold" href={WHATSAPP}>
            WhatsApp
          </a>
        </nav>
      </header>

      <main id="accueil">
        <section className="hero">
          <img src="/voyage.jpg" alt="Côte camerounaise" />
          <div className="hero-copy">
            <p className="kicker">Groupe Kalao · Yaoundé</p>
            <h1>Partir depuis ici.</h1>
            <p className="lede">
              Billets, séjours et formalités, suivis par le Groupe Kalao à Bastos — pas
              par une plateforme anonyme.
            </p>
            <div className="hero-actions">
              <a className="btn btn-gold" href={WHATSAPP}>
                Demander un devis
              </a>
              <a className="btn btn-ghost" href={PHONE}>
                Appeler
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="offres">
          <p className="kicker" style={{ color: "var(--teal)" }}>
            Ce que nous faisons
          </p>
          <h2>Trois lignes, un interlocuteur.</h2>
          <p className="narrow">
            Pas de catalogue figé ni de tarifs affichés au hasard. Chaque dossier est
            chiffré selon les dates, la compagnie et les pièces réellement exigées.
          </p>
          <div className="services">
            <article className="service">
              <span className="num">01</span>
              <div>
                <strong>Billetterie</strong>
                <p className="narrow" style={{ margin: 0 }}>
                  Aller-retour et multi-destinations, au départ de Yaoundé ou Douala.
                </p>
              </div>
            </article>
            <article className="service">
              <span className="num">02</span>
              <div>
                <strong>Séjours</strong>
                <p className="narrow" style={{ margin: 0 }}>
                  Côte camerounaise, circuits Afrique, Europe — construits avec vous.
                </p>
              </div>
            </article>
            <article className="service">
              <span className="num">03</span>
              <div>
                <strong>Formalités</strong>
                <p className="narrow" style={{ margin: 0 }}>
                  Checklist, rendez-vous, suivi. L’immigration du groupe (visas Canada,
                  Russie, Allemagne) reste un pôle à part, sur rendez-vous.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="section desk" id="bureau">
          <p className="kicker">Le bureau</p>
          <h2>Bastos, pas un call center.</h2>
          <p className="narrow">
            Le Groupe Kalao vous reçoit à Yaoundé. Un devis se discute autour d’un
            trajet réel, pas d’un formulaire de 40 champs.
          </p>
          <div className="coords">
            <div>
              <p className="kicker">Adresse</p>
              <p>
                Carrefour Bastos
                <br />
                Yaoundé, Cameroun
              </p>
            </div>
            <div>
              <p className="kicker">Téléphone</p>
              <p>
                <a href={PHONE}>+237 694 635 250</a>
                <br />
                <a href="tel:+237673794702">+237 673 794 702</a>
              </p>
            </div>
            <div>
              <p className="kicker">Écrire</p>
              <p>
                <a href={MAIL}>contact@groupe-kalao.com</a>
                <br />
                <a href={WHATSAPP}>WhatsApp</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <span>Groupe Kalao · Yaoundé</span>
        <span>Voyages · Événementiel · Photo</span>
      </footer>
    </>
  );
}
