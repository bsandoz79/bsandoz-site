import { useEffect, useState, type FormEvent } from 'react';
import { Button, Calendar, aujourdhui, debutDuMois } from '@bsandoz79/blocs';
import { adminTextes } from '../../data/admin';
import { dateLisible } from '../../data/espace';
import { lireDisponibilites } from '../RendezVous/reservation';
import { enregistrerDisponibilites, type ReglesDisponibilites } from './api';
import styles from './Admin.module.css';

const t = adminTextes.disponibilites;

/** Heures proposées : de 7 h à 20 h, toutes les demi-heures. */
const HEURES = Array.from({ length: 27 }, (_, i) => {
  const minutes = 7 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
});

const basculer = <T,>(liste: T[], valeur: T) => (liste.includes(valeur) ? liste.filter((x) => x !== valeur) : [...liste, valeur].sort());

/** Jours travaillés, heures et jours fermés, réglés d'un clic. Le calendrier du site les suit. */
export function DisponibilitesAdmin() {
  const [jours, setJours] = useState<number[] | null>(null);
  const [creneaux, setCreneaux] = useState<string[]>([]);
  const [fermes, setFermes] = useState<string[]>([]);
  const [jourCourant] = useState(() => aujourdhui());
  const [mois, setMois] = useState(() => debutDuMois(jourCourant));
  const [retour, setRetour] = useState<{ texte: string; erreur: boolean } | null>(null);

  useEffect(() => {
    let actif = true;
    lireDisponibilites()
      .then((d) => {
        if (!actif) return;
        setJours(d.joursTravailles);
        setCreneaux(d.creneaux);
        setFermes(d.joursFermes);
      })
      .catch(() => actif && setRetour({ texte: t.lectureImpossible, erreur: true }));
    return () => {
      actif = false;
    };
  }, []);

  async function enregistrer(evenement: FormEvent) {
    evenement.preventDefault();
    if (!jours) return;
    const regles: ReglesDisponibilites = { joursTravailles: jours, creneaux, joursFermes: fermes };
    setRetour(null);
    try {
      const resultat = await enregistrerDisponibilites(regles);
      setRetour(resultat.ok ? { texte: t.enregistre, erreur: false } : { texte: resultat.erreur, erreur: true });
    } catch {
      setRetour({ texte: t.echec, erreur: true });
    }
  }

  // Une heure déjà enregistrée hors de la grille (10:15…) reste visible et modifiable.
  const heures = [...new Set([...HEURES, ...creneaux])].sort();

  return (
    <section className={styles.carte} aria-labelledby="admin-disponibilites">
      <h2 id="admin-disponibilites">{t.titre}</h2>
      <p className={styles.aide}>{t.aide}</p>
      {jours && (
        <form onSubmit={enregistrer} noValidate className={styles.formulaire}>
          <fieldset className={styles.groupe}>
            <legend>{t.jours}</legend>
            <p className={styles.aide}>{t.aideJours}</p>
            <div className={styles.jours}>
              {t.joursCourts.map((court, i) => (
                <button
                  key={court}
                  type="button"
                  className={styles.choix}
                  aria-pressed={jours.includes(i)}
                  aria-label={t.nomsDesJours[i]}
                  onClick={() => setJours(basculer(jours, i))}
                >
                  {court}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.groupe}>
            <legend>{t.creneaux}</legend>
            <p className={styles.aide}>{t.aideCreneaux}</p>
            {t.periodes.map((periode) => (
              <div key={periode.nom} className={styles.periode}>
                <p className={styles.periodeNom}>{periode.nom}</p>
                <div className={styles.heures}>
                  {heures
                    .filter((h) => h >= periode.de && h <= periode.a)
                    .map((heure) => (
                      <button
                        key={heure}
                        type="button"
                        className={styles.choix}
                        aria-pressed={creneaux.includes(heure)}
                        onClick={() => setCreneaux(basculer(creneaux, heure))}
                      >
                        {heure}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </fieldset>

          <fieldset className={styles.groupe}>
            <legend>{t.fermes}</legend>
            <p className={styles.aide}>{t.aideFermes}</p>
            <div className={styles.conges}>
              <Calendar
                label={t.calendrier}
                month={mois}
                onMonthChange={setMois}
                value={null}
                onChange={(jour) => setFermes(basculer(fermes, jour))}
                min={jourCourant}
                today={jourCourant}
                isMarked={(jour) => fermes.includes(jour)}
                markedLabel={t.marque}
              />
              {fermes.length === 0 ? (
                <p className={styles.aide}>{t.aucunFerme}</p>
              ) : (
                <ul className={styles.fermes}>
                  {fermes.map((jour) => (
                    <li key={jour}>
                      <button
                        type="button"
                        className={styles.ferme}
                        aria-label={t.rouvrir(dateLisible(`${jour}T12:00:00`))}
                        onClick={() => setFermes(fermes.filter((j) => j !== jour))}
                      >
                        {dateLisible(`${jour}T12:00:00`)} <span aria-hidden="true">×</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </fieldset>

          <div className={styles.enregistrer}>
            <Button type="submit">{t.enregistrer}</Button>
            {retour && (
              <p className={retour.erreur ? styles.erreur : styles.succes} role={retour.erreur ? 'alert' : 'status'}>
                {retour.texte}
              </p>
            )}
          </div>
        </form>
      )}
      {!jours && retour && (
        <p className={retour.erreur ? styles.erreur : styles.succes} role={retour.erreur ? 'alert' : 'status'}>
          {retour.texte}
        </p>
      )}
    </section>
  );
}
