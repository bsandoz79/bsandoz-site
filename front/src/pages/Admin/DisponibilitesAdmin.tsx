import { useEffect, useState, type FormEvent } from 'react';
import { Button, TextField } from '@bsandoz79/blocs';
import { adminTextes } from '../../data/admin';
import { dateLisible } from '../../data/espace';
import { lireDisponibilites } from '../RendezVous/reservation';
import { enregistrerDisponibilites, type ReglesDisponibilites } from './api';
import styles from './Admin.module.css';

const t = adminTextes.disponibilites;

const lireCreneaux = (texte: string) =>
  texte
    .split(/[\s,;]+/)
    .map((c) => c.trim())
    .filter(Boolean);

/** Jours travaillés, créneaux et jours fermés. Le calendrier du site les suit. */
export function DisponibilitesAdmin() {
  const [jours, setJours] = useState<number[] | null>(null);
  const [creneaux, setCreneaux] = useState('');
  const [fermes, setFermes] = useState<string[]>([]);
  const [nouveauFerme, setNouveauFerme] = useState('');
  const [retour, setRetour] = useState<{ texte: string; erreur: boolean } | null>(null);

  useEffect(() => {
    let actif = true;
    lireDisponibilites()
      .then((d) => {
        if (!actif) return;
        setJours(d.joursTravailles);
        setCreneaux(d.creneaux.join(', '));
        setFermes(d.joursFermes);
      })
      .catch(() => actif && setRetour({ texte: t.lectureImpossible, erreur: true }));
    return () => {
      actif = false;
    };
  }, []);

  function basculer(jour: number) {
    setJours((liste) => {
      const actuels = liste ?? [];
      return actuels.includes(jour) ? actuels.filter((j) => j !== jour) : [...actuels, jour].sort();
    });
  }

  function ajouterFerme() {
    if (nouveauFerme && !fermes.includes(nouveauFerme)) setFermes([...fermes, nouveauFerme].sort());
    setNouveauFerme('');
  }

  async function enregistrer(evenement: FormEvent) {
    evenement.preventDefault();
    if (!jours) return;
    const regles: ReglesDisponibilites = { joursTravailles: jours, creneaux: lireCreneaux(creneaux), joursFermes: fermes };
    setRetour(null);
    try {
      const resultat = await enregistrerDisponibilites(regles);
      if (resultat.ok) {
        setCreneaux(resultat.regles.creneaux.join(', '));
        setRetour({ texte: t.enregistre, erreur: false });
      } else setRetour({ texte: resultat.erreur, erreur: true });
    } catch {
      setRetour({ texte: t.echec, erreur: true });
    }
  }

  return (
    <section className={styles.carte} aria-labelledby="admin-disponibilites">
      <h2 id="admin-disponibilites">{t.titre}</h2>
      <p className={styles.aide}>{t.aide}</p>
      {retour && (
        <p className={retour.erreur ? styles.erreur : styles.succes} role={retour.erreur ? 'alert' : 'status'}>
          {retour.texte}
        </p>
      )}
      {jours && (
        <form onSubmit={enregistrer} noValidate className={styles.formulaire}>
          <fieldset className={styles.groupe}>
            <legend>{t.jours}</legend>
            <div className={styles.actions}>
              {t.nomsDesJours.map((nom, i) => (
                <label key={nom} className={styles.caseACocher}>
                  <input type="checkbox" checked={jours.includes(i)} onChange={() => basculer(i)} />
                  {nom}
                </label>
              ))}
            </div>
          </fieldset>
          <TextField label={t.creneaux} hint={t.aideCreneaux} value={creneaux} onChange={(e) => setCreneaux(e.target.value)} />
          <fieldset className={styles.groupe}>
            <legend>{t.fermes}</legend>
            {fermes.length > 0 && (
              <ul className={styles.liste}>
                {fermes.map((jour) => (
                  <li key={jour} className={styles.rangee}>
                    <span>{dateLisible(`${jour}T12:00:00`)}</span>
                    <Button variant="ghost" onClick={() => setFermes(fermes.filter((j) => j !== jour))} aria-label={t.rouvrir(dateLisible(`${jour}T12:00:00`))}>
                      {t.retirer}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.rangee}>
              <TextField label={t.nouveauFerme} type="date" value={nouveauFerme} onChange={(e) => setNouveauFerme(e.target.value)} />
              <Button variant="secondary" onClick={ajouterFerme}>
                {t.ajouterFerme}
              </Button>
            </div>
          </fieldset>
          <div>
            <Button type="submit">{t.enregistrer}</Button>
          </div>
        </form>
      )}
    </section>
  );
}
