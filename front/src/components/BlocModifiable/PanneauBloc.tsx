import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { TextField, buttonClassName } from '@bsandoz79/blocs';
import { imageEnBase64 } from '../../app/image';
import { editionTextes as t } from '../../data/admin';
import { appliquerContenus, contenusActuels, type Bloc, type Champ } from '../../data/blocs';
import { ecrireCacheContenus, signalerContenus } from '../../data/contenusEnLigne';
import { changerPrix, prixDeBase, prixModifiesActuels } from '../../data/prixEnLigne';
import { enregistrerContenus, enregistrerPrix, envoyerImage } from '../../pages/Admin/api';
import styles from './BlocModifiable.module.css';

/** Panneau latéral : tout ce que contient un bloc, modifiable, enregistré d'un coup. */
export default function PanneauBloc({ bloc, onFermer }: { bloc: Bloc; onFermer: () => void }) {
  const [saisies, setSaisies] = useState<Record<string, string>>(() => Object.fromEntries(bloc.champs.map((c) => [c.cle, c.lire()])));
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [imageEnCours, setImageEnCours] = useState<string | null>(null);
  const panneau = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panneau.current?.querySelector<HTMLElement>('input, textarea, button')?.focus();
  }, []);

  const maj = (cle: string, valeur: string) => setSaisies((s) => ({ ...s, [cle]: valeur }));

  async function choisirImage(champ: Champ, evenement: ChangeEvent<HTMLInputElement>) {
    const fichier = evenement.target.files?.[0];
    evenement.target.value = '';
    if (!fichier) return;
    setErreur('');
    setImageEnCours(champ.cle);
    try {
      const url = await envoyerImage(await imageEnBase64(fichier));
      if (url) maj(champ.cle, url);
      else setErreur(t.echecImage);
    } catch {
      setErreur(t.echecImage);
    } finally {
      setImageEnCours(null);
    }
  }

  async function enregistrer(evenement: FormEvent) {
    evenement.preventDefault();
    const changes = bloc.champs.filter((c) => saisies[c.cle] !== c.lire());
    if (changes.length === 0) {
      onFermer();
      return;
    }
    const prixChanges = changes.filter((c) => c.type === 'prix');
    const invalide = prixChanges.find((c) => !/^\d+$/.test(saisies[c.cle].trim()));
    if (invalide) {
      setErreur(t.prixInvalide(invalide.libelle));
      return;
    }
    const contenus = Object.fromEntries(
      changes.filter((c) => c.type !== 'prix').map((c) => [c.cle, saisies[c.cle] === c.base ? null : saisies[c.cle]]),
    );
    const prix = { ...prixModifiesActuels() };
    for (const c of prixChanges) {
      const montant = Number(saisies[c.cle].trim());
      if (montant === prixDeBase[c.cle]) delete prix[c.cle];
      else prix[c.cle] = montant;
    }
    setEnvoi(true);
    setErreur('');
    try {
      const contenusOk = Object.keys(contenus).length === 0 || (await enregistrerContenus(contenus));
      const prixOk = contenusOk && (prixChanges.length === 0 || (await enregistrerPrix(prix)));
      if (!contenusOk || !prixOk) {
        setErreur(t.echec);
        return;
      }
      // Une valeur revenue au texte du code est réécrite ici ; les autres sont appliquées telles quelles.
      for (const c of changes) if (c.type !== 'prix') c.ecrire(saisies[c.cle]);
      appliquerContenus(contenusActuels());
      ecrireCacheContenus(contenusActuels());
      signalerContenus();
      if (prixChanges.length > 0) changerPrix(prix);
      onFermer();
    } catch {
      setErreur(t.echec);
    } finally {
      setEnvoi(false);
    }
  }

  function surTouche(evenement: KeyboardEvent) {
    if (evenement.key === 'Escape') {
      evenement.preventDefault();
      onFermer();
      return;
    }
    if (evenement.key !== 'Tab') return;
    // Le focus reste dans le panneau.
    const cibles = Array.from(panneau.current?.querySelectorAll<HTMLElement>('input, textarea, button, a[href]') ?? []);
    if (cibles.length === 0) return;
    const premiere = cibles[0];
    const derniere = cibles[cibles.length - 1];
    if (evenement.shiftKey && document.activeElement === premiere) {
      evenement.preventDefault();
      derniere.focus();
    } else if (!evenement.shiftKey && document.activeElement === derniere) {
      evenement.preventDefault();
      premiere.focus();
    }
  }

  return (
    <div className={styles.fond}>
      <div
        ref={panneau}
        className={styles.panneau}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panneau-bloc-titre"
        onKeyDown={surTouche}
      >
        <h2 id="panneau-bloc-titre" className={styles.panneauTitre}>
          {t.panneau(bloc.titre)}
        </h2>
        <form className={styles.champs} onSubmit={enregistrer} noValidate>
          {bloc.champs.map((c) =>
            c.type === 'image' ? (
              <div key={c.cle} className={styles.image}>
                <p className={styles.imageNom}>{c.libelle}</p>
                <img src={saisies[c.cle]} alt="" className={styles.apercu} />
                <label className={buttonClassName({ variant: 'secondary' })}>
                  {imageEnCours === c.cle ? t.envoiImage : t.changerImage}
                  <span className="sr-only"> : {c.libelle}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className={styles.fichier}
                    disabled={imageEnCours !== null}
                    onChange={(e) => void choisirImage(c, e)}
                  />
                </label>
              </div>
            ) : (
              <TextField
                key={c.cle}
                label={c.libelle}
                multiline={c.type === 'long' ? true : undefined}
                value={saisies[c.cle]}
                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => maj(c.cle, e.target.value)}
              />
            ),
          )}
          {erreur && (
            <p className={styles.erreur} role="alert">
              {erreur}
            </p>
          )}
          <div className={styles.actions}>
            <button type="submit" className={buttonClassName()} disabled={envoi || imageEnCours !== null}>
              {envoi ? t.envoi : t.enregistrer}
            </button>
            <button type="button" className={buttonClassName({ variant: 'secondary' })} onClick={onFermer}>
              {t.annuler}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
