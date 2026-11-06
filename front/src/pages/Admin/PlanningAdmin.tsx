import { useEffect, useMemo, useState, type CSSProperties, type ChangeEvent, type ReactNode } from 'react';
import { Button, TextField, ajouterJours, aujourdhui, debutDuMois, jourDeLaSemaine, libelleLong, type DateIso } from '@bsandoz79/blocs';
import { adminTextes } from '../../data/admin';
import { formatPrix } from '../../data/offres';
import { origineDuSite, pages } from '../../data/pages';
import { disponibilites } from '../../data/rendezvous';
import { lireDisponibilites } from '../RendezVous/reservation';
import { annulerRendezVousAdmin, listerRendezVous, type LigneDemande, type RendezVousAdmin } from './api';
import { calculerStatistiques, joursDeLaSemaine, lundiDe, placesDeLaSemaine } from './statistiques';
import styles from './Planning.module.css';

const t = adminTextes.planning;
const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const enMinutes = (heure: string) => {
  const [h, m] = heure.split(':').map(Number);
  return h * 60 + m;
};

/** Planning de la semaine et chiffres clés du back-office. */
export function PlanningAdmin({ demandes }: { demandes: LigneDemande[] }) {
  const [jourCourant] = useState(() => aujourdhui());
  const [lundi, setLundi] = useState(() => lundiDe(jourCourant));
  const [semaine, setSemaine] = useState<RendezVousAdmin[] | null>(null);
  const [periode, setPeriode] = useState<RendezVousAdmin[]>([]);
  const [regles, setRegles] = useState({ joursTravailles: disponibilites.joursTravailles, creneaux: disponibilites.creneaux, joursFermes: disponibilites.joursFermes });
  const [erreur, setErreur] = useState(false);
  const [choisi, setChoisi] = useState<RendezVousAdmin | null>(null);

  const jours = useMemo(() => joursDeLaSemaine(lundi), [lundi]);

  useEffect(() => {
    let actif = true;
    listerRendezVous(jours[0], jours[6])
      .then((liste) => {
        if (!actif) return;
        setSemaine(liste ?? []);
        setErreur(liste === null);
      })
      .catch(() => actif && setErreur(true));
    return () => {
      actif = false;
    };
  }, [jours]);

  // Les chiffres portent sur le mois en cours et les 7 prochains jours, quelle que soit la semaine affichée.
  useEffect(() => {
    let actif = true;
    listerRendezVous(debutDuMois(jourCourant), ajouterJours(jourCourant, 38))
      .then((liste) => actif && liste && setPeriode(liste))
      .catch(() => undefined);
    lireDisponibilites()
      .then((d) => actif && setRegles(d))
      .catch(() => undefined);
    return () => {
      actif = false;
    };
  }, [jourCourant]);

  const stats = calculerStatistiques({
    rdvPeriode: periode,
    rdvSemaine: semaine ?? [],
    demandes,
    aujourdhui: jourCourant,
    places: placesDeLaSemaine(lundi, regles),
  });

  // Plage horaire affichée : de 8 h à 19 h, élargie si un rendez-vous ou un créneau en sort.
  const minutes = [...(semaine ?? []).flatMap((r) => [enMinutes(r.heure), enMinutes(r.fin)]), ...regles.creneaux.map(enMinutes)];
  const debut = Math.min(8 * 60, ...minutes.map((m) => Math.floor(m / 60) * 60));
  const fin = Math.max(19 * 60, ...minutes.map((m) => Math.ceil(m / 60) * 60));
  const heures = Array.from({ length: (fin - debut) / 60 }, (_, i) => debut / 60 + i);
  const position = (r: RendezVousAdmin): CSSProperties => ({
    top: `${((enMinutes(r.heure) - debut) / (fin - debut)) * 100}%`,
    height: `${((enMinutes(r.fin) - enMinutes(r.heure)) / (fin - debut)) * 100}%`,
  });

  function misAJour(rdv: RendezVousAdmin) {
    const remplacer = (liste: RendezVousAdmin[]) => liste.map((r) => (r.id === rdv.id ? rdv : r));
    setSemaine((s) => s && remplacer(s));
    setPeriode(remplacer);
    setChoisi(rdv);
  }

  const cartes = [
    { titre: t.stats.aVenir, valeur: String(stats.aVenir), detail: t.stats.aVenirDetail },
    { titre: t.stats.mois, valeur: String(stats.mois), detail: t.stats.moisDetail },
    { titre: t.stats.occupation, valeur: stats.occupation === null ? '–' : `${stats.occupation} %`, detail: t.stats.occupationDetail },
    { titre: t.stats.annules, valeur: String(stats.annules), detail: t.stats.annulesDetail },
    { titre: t.stats.aTraiter, valeur: String(stats.aTraiter), detail: t.stats.aTraiterDetail },
    { titre: t.stats.acceptes, valeur: String(stats.acceptes), detail: t.stats.acceptesDetail },
    { titre: t.stats.caMois, valeur: formatPrix(stats.caMois), detail: t.stats.caMoisDetail },
    { titre: t.stats.caSigne, valeur: formatPrix(stats.caSigne), detail: t.stats.caSigneDetail },
    { titre: t.stats.caEnAttente, valeur: formatPrix(stats.caEnAttente), detail: t.stats.caEnAttenteDetail },
  ];

  return (
    <div className={styles.planning}>
      <section aria-label={t.statistiques}>
        <ul className={styles.stats}>
          {cartes.map((c) => (
            <li key={c.titre} className={styles.stat}>
              <p className={styles.statValeur}>{c.valeur}</p>
              <p className={styles.statTitre}>{c.titre}</p>
              <p className={styles.statDetail}>{c.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.semaine} aria-labelledby="planning-titre">
        <div className={styles.entete}>
          <div>
            <h2 id="planning-titre" className={styles.titre}>
              {t.titre}
            </h2>
            <p className={styles.periode}>{t.semaine(libelleLong(jours[0]), libelleLong(jours[6]))}</p>
          </div>
          <div className={styles.navigation}>
            <Button variant="secondary" onClick={() => setLundi(lundiDe(jourCourant))}>
              {t.aujourdhui}
            </Button>
            <Button variant="secondary" aria-label={t.precedente} onClick={() => setLundi(ajouterJours(lundi, -7))}>
              ‹
            </Button>
            <Button variant="secondary" aria-label={t.suivante} onClick={() => setLundi(ajouterJours(lundi, 7))}>
              ›
            </Button>
          </div>
        </div>

        {erreur && (
          <p className={styles.erreur} role="alert">
            {t.lectureImpossible}
          </p>
        )}

        {/* Sur ordinateur : la grille de la semaine. */}
        <div className={styles.grille} data-testid="grille">
          <div className={styles.coin} />
          {jours.map((jour, i) => (
            <div key={jour} className={jour === jourCourant ? `${styles.jourTete} ${styles.aujourdhui}` : styles.jourTete}>
              <span>{JOURS[i]}</span>
              <strong>{Number(jour.slice(8))}</strong>
            </div>
          ))}
          <div className={styles.heures}>
            {heures.map((h) => (
              <div key={h} className={styles.heure}>
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>
          {jours.map((jour) => {
            const ouvert = regles.joursTravailles.includes(jourDeLaSemaine(jour)) && !regles.joursFermes.includes(jour);
            return (
              <div key={jour} className={ouvert ? styles.colonne : `${styles.colonne} ${styles.ferme}`} style={{ '--nb-heures': heures.length } as CSSProperties}>
                {heures.map((h) => (
                  <div key={h} className={styles.ligne} />
                ))}
                {(semaine ?? [])
                  .filter((r) => r.jour === jour)
                  .map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={r.statut === 'annule' ? `${styles.rdv} ${styles.rdvAnnule}` : styles.rdv}
                      style={position(r)}
                      onClick={() => setChoisi(r)}
                    >
                      <strong>{r.heure}</strong> {r.nom}
                      {r.statut === 'annule' && <span> ({t.annule})</span>}
                    </button>
                  ))}
              </div>
            );
          })}
        </div>

        {/* Sur téléphone : la liste des rendez-vous de la semaine. */}
        <ul className={styles.liste} data-testid="liste">
          {(semaine ?? []).map((r) => (
            <li key={r.id}>
              <button type="button" className={r.statut === 'annule' ? `${styles.ligneRdv} ${styles.rdvAnnule}` : styles.ligneRdv} onClick={() => setChoisi(r)}>
                <strong>
                  {libelleLong(r.jour)}, {r.heure}
                </strong>
                <span>
                  {r.nom} · {r.lieuLibelle}
                  {r.statut === 'annule' && ` · ${t.annule}`}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {semaine?.length === 0 && !erreur && <p className={styles.aucun}>{t.aucun}</p>}
      </section>

      {choisi && <DetailRendezVous rdv={choisi} onFermer={() => setChoisi(null)} onChange={misAJour} />}
    </div>
  );
}

function DetailRendezVous({ rdv, onFermer, onChange }: { rdv: RendezVousAdmin; onFermer: () => void; onChange: (r: RendezVousAdmin) => void }) {
  const d = t.detail;
  const [confirmation, setConfirmation] = useState(false);
  const [message, setMessage] = useState('');
  const [manque, setManque] = useState(false);
  const [echec, setEchec] = useState(false);

  async function annuler() {
    if (!message.trim()) {
      setManque(true);
      return;
    }
    setManque(false);
    setEchec(false);
    try {
      const resultat = await annulerRendezVousAdmin(rdv.id, message.trim(), `${origineDuSite()}${pages.rendezVous.path}`);
      if (resultat) {
        onChange(resultat);
        setConfirmation(false);
      } else setEchec(true);
    } catch {
      setEchec(true);
    }
  }

  const lignes: [string, ReactNode][] = [
    [d.quand, `${libelleLong(rdv.jour as DateIso)}, ${rdv.heure} – ${rdv.fin}`],
    [d.lieu, rdv.adresse ? `${rdv.lieuLibelle} : ${rdv.adresse}` : rdv.lieuLibelle],
    [d.telephone, <a key="tel" href={`tel:${rdv.telephone.replace(/\s/g, '')}`}>{rdv.telephone}</a>],
    [d.email, <a key="mail" href={`mailto:${rdv.email}`}>{rdv.email}</a>],
  ];
  if (rdv.activite) lignes.push([d.activite, rdv.activite]);
  if (rdv.frais) lignes.push([d.frais, `${rdv.frais}${rdv.kmFactures ? ` (${d.km(rdv.kmFactures)})` : ''}`]);
  if (rdv.message) lignes.push([d.message, rdv.message]);

  return (
    <section className={styles.detail} aria-labelledby="detail-rdv">
      <h3 id="detail-rdv" className={styles.titre}>
        {rdv.nom}
        {rdv.statut === 'annule' && ` (${t.annule})`}
      </h3>
      <dl className={styles.champs}>
        {lignes.map(([cle, valeur]) => (
          <div key={cle}>
            <dt>{cle}</dt>
            <dd>{valeur}</dd>
          </div>
        ))}
      </dl>
      {echec && (
        <p className={styles.erreur} role="alert">
          {d.echec}
        </p>
      )}
      {rdv.statut === 'confirme' && confirmation && (
        <TextField
          label={d.disponibilites}
          hint={d.aideDisponibilites}
          placeholder={d.exemple}
          multiline
          required
          value={message}
          error={manque ? d.manque : undefined}
          onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setMessage(e.target.value);
            setManque(false);
          }}
        />
      )}
      <div className={styles.navigation}>
        {rdv.statut === 'confirme' &&
          (confirmation ? (
            <>
              <Button onClick={() => void annuler()}>{d.confirmer}</Button>
              <Button variant="secondary" onClick={() => setConfirmation(false)}>
                {d.garder}
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setConfirmation(true)}>
              {d.annuler}
            </Button>
          ))}
        <Button variant="ghost" onClick={onFermer}>
          {d.fermer}
        </Button>
      </div>
    </section>
  );
}
