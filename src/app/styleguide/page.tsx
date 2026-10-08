import type { Metadata } from "next";
import styles from "./styleguide.module.css";

export const metadata: Metadata = {
  title: "Directions visuelles",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "Bleu logo", className: "swatchBrand" },
  { name: "Orange logo", className: "swatchAccent" },
  { name: "Fond", className: "swatchBg" },
  { name: "Surface", className: "swatchSurface" },
  { name: "Encre", className: "swatchInk" },
] as const;

function Direction({
  id,
  title,
  text,
}: {
  id: "atelier" | "signal";
  title: string;
  text: string;
}) {
  return (
    <article className={styles.direction} data-direction={id}>
      <header className={styles.directionHead}>
        <h2>{title}</h2>
        <p>{text}</p>
      </header>
      <div className={styles.swatches}>
        {swatches.map((item) => (
          <div key={item.name} className={styles.swatchItem}>
            <div className={`${styles.swatch} ${styles[item.className]}`} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <p className={styles.typeSample}>
        Golos Text · <strong>Dossier visa</strong> · 1 100 000 FCFA
      </p>
      <div className={styles.demoRow}>
        <button type="button" className={`${styles.btnDemo} ${styles.btnBrand}`}>
          Enregistrer
        </button>
        <button type="button" className={`${styles.btnDemo} ${styles.btnQuiet}`}>
          Annuler
        </button>
        <button type="button" className={`${styles.btnDemo} ${styles.btnDangerDemo}`}>
          Supprimer
        </button>
      </div>
      <div className={styles.fieldDemo}>
        <label htmlFor={`${id}-amount`}>Montant</label>
        <input id={`${id}-amount`} defaultValue="1 100 000" readOnly />
        <small>FCFA · champ obligatoire marqué plus tard par une astérisque</small>
      </div>
      <div className={styles.kpiDemo}>
        <span>Encaissé ce mois</span>
        <strong>20,85 M FCFA</strong>
        <em>20 850 000 FCFA au survol, plus tard</em>
      </div>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Facture</th>
              <th>Statut</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>FAC-KALAO-2026-0042</td>
              <td>Émise</td>
              <td>1 100 000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.badgeRow}>
        <span className={`${styles.badgeDemo} ${styles.badgeDraft}`}>Brouillon</span>
        <span className={`${styles.badgeDemo} ${styles.badgeIssued}`}>Émise</span>
        <span className={`${styles.badgeDemo} ${styles.badgePaid}`}>Payée</span>
        <span className={`${styles.badgeDemo} ${styles.badgeLate}`}>En retard</span>
      </div>
      <div className={styles.modalDemo}>
        <header>
          <strong>Nouvelle facture</strong>
          <span>Échap</span>
        </header>
        <p>Le bouton principal reste à droite. Le rouge n&apos;est plus l&apos;action par défaut.</p>
        <footer>
          <span />
          <button type="button" className={`${styles.btnDemo} ${styles.btnBrand}`}>
            Créer
          </button>
        </footer>
      </div>
      <div className={styles.sideDemo}>
        <nav>
          <div>Tableau de bord</div>
          <div className={styles.on}>Factures</div>
          <div>Dossiers</div>
        </nav>
        <section>Un seul élément de menu actif.</section>
      </div>
    </article>
  );
}

export default function StyleGuidePage() {
  return (
    <main className={styles.kalaoGuide}>
      <div className={styles.kalaoGuideIntro}>
        <h1>Deux directions, rien n&apos;est appliqué</h1>
        <p>
          Le logo est bleu #0071BC et orange #FBB03B. Les jetons suivent Signal et restent
          éteints tant que data-theme-kalao n&apos;est pas posé. Atelier reste affiché ici pour
          comparaison. Le bouton principal du modèle est encore rouge #E41F07.
        </p>
      </div>
      <div className={styles.kalaoGuideGrid}>
        <Direction
          id="atelier"
          title="Atelier"
          text="Fond ivoire, barre claire, rayon 8 px. Le bleu du logo porte les actions. L'orange ne sert qu'à un repère, pas aux boutons."
        />
        <Direction
          id="signal"
          title="Signal"
          text="Barre bleu nuit, fond gris froid, rayon 4 px. Même bleu pour les boutons, orange seulement sur l'élément actif ou un graphique."
        />
      </div>
    </main>
  );
}
