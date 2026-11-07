import { useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent, type RefObject } from 'react';
import { TextField, buttonClassName } from '@bsandoz79/blocs';
import { imageEnBase64 } from '../../app/image';
import { editionTextes as t } from '../../data/admin';
import { appliquerContenus, contenusActuels, type Bloc, type Champ } from '../../data/blocs';
import { ecrireCacheContenus, signalerContenus } from '../../data/contenusEnLigne';
import { changerPrix, prixDeBase, prixModifiesActuels } from '../../data/prixEnLigne';
import { enregistrerContenus, enregistrerPrix, envoyerImage } from '../../pages/Admin/api';
import { trouverCibles, type Cible } from './cibles';
import styles from './BlocModifiable.module.css';

type Props = {
  bloc: Bloc;
  racine: RefObject<HTMLDivElement | null>;
  /** Change à chaque réaffichage du bloc : les cibles sont alors recalculées. */
  version: number;
  /** Réaffiche le bloc avec les valeurs en cours (aperçu sur place). */
  onApercu: () => void;
  onFermer: () => void;
};

const estPrix = (valeur: string) => /^\d+$/.test(valeur.trim());

/**
 * Édition sur place : chaque texte, prix ou image du bloc est encadré. Un clic ouvre une petite bulle
 * juste à côté ; « Valider » montre le changement dans la page. La barre du bloc enregistre tout d'un coup,
 * ou annule et remet les valeurs d'avant. Ce qui n'est pas visible (texte de remplacement…) est dans « Autres textes ».
 */
export default function EditeurBloc({ bloc, racine, version, onApercu, onFermer }: Props) {
  // Valeurs à l'ouverture : « Annuler » y revient, « Enregistrer » envoie ce qui en diffère.
  const [originaux] = useState(() => Object.fromEntries(bloc.champs.map((c) => [c.cle, c.lire()])));
  const [cibles, setCibles] = useState<Cible[]>([]);
  const [absents, setAbsents] = useState<Champ[]>([]);
  const [actif, setActif] = useState<{ cible: Cible; index: number } | null>(null);
  const [saisie, setSaisie] = useState('');
  const [erreurBulle, setErreurBulle] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [imageEnCours, setImageEnCours] = useState(false);
  const [autres, setAutres] = useState(false);
  const barre = useRef<HTMLDivElement>(null);
  const boutons = useRef<(HTMLButtonElement | null)[]>([]);

  // Les cibles suivent la page : après chaque aperçu, au redimensionnement, et après les apparitions animées.
  useLayoutEffect(() => {
    const calculer = () => {
      if (!racine.current) return;
      const r = trouverCibles(racine.current, bloc.champs);
      setCibles(r.cibles);
      setAbsents(r.absents);
    };
    calculer();
    const minuterie = window.setTimeout(calculer, 450);
    window.addEventListener('resize', calculer);
    return () => {
      window.clearTimeout(minuterie);
      window.removeEventListener('resize', calculer);
    };
  }, [version, racine, bloc]);

  useEffect(() => {
    barre.current?.querySelector<HTMLElement>('button')?.focus();
  }, []);

  function ouvrir(cible: Cible, index: number) {
    setActif({ cible, index });
    setSaisie(cible.champ.lire());
    setErreurBulle('');
  }

  function fermerBulle() {
    const index = actif?.index;
    setActif(null);
    if (index !== undefined) requestAnimationFrame(() => boutons.current[index]?.focus());
  }

  /** Applique une valeur à la page, sans l'enregistrer encore. */
  function appliquer(champ: Champ, valeur: string) {
    if (champ.type === 'prix' && !estPrix(valeur)) {
      setErreurBulle(t.prixInvalide(champ.libelle));
      return false;
    }
    champ.ecrire(champ.type === 'prix' ? valeur.trim() : valeur);
    onApercu();
    return true;
  }

  function valider(evenement: FormEvent) {
    evenement.preventDefault();
    if (actif && appliquer(actif.cible.champ, saisie)) fermerBulle();
  }

  async function choisirImage(champ: Champ, evenement: ChangeEvent<HTMLInputElement>) {
    const fichier = evenement.target.files?.[0];
    evenement.target.value = '';
    if (!fichier) return;
    setErreurBulle('');
    setImageEnCours(true);
    try {
      const url = await envoyerImage(await imageEnBase64(fichier));
      if (url) {
        appliquer(champ, url);
        fermerBulle();
      } else setErreurBulle(t.echecImage);
    } catch {
      setErreurBulle(t.echecImage);
    } finally {
      setImageEnCours(false);
    }
  }

  function annuler() {
    for (const c of bloc.champs) if (c.lire() !== originaux[c.cle]) c.ecrire(originaux[c.cle]);
    onApercu();
    onFermer();
  }

  async function enregistrer() {
    const changes = bloc.champs.filter((c) => c.lire() !== originaux[c.cle]);
    if (changes.length === 0) {
      onFermer();
      return;
    }
    const prixChanges = changes.filter((c) => c.type === 'prix');
    const contenus = Object.fromEntries(
      changes.filter((c) => c.type !== 'prix').map((c) => [c.cle, c.lire() === c.base ? null : c.lire()]),
    );
    const prix = { ...prixModifiesActuels() };
    for (const c of prixChanges) {
      const montant = Number(c.lire());
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
    if (evenement.key !== 'Escape') return;
    evenement.preventDefault();
    if (actif) fermerBulle();
    else annuler();
  }

  const champActif = actif?.cible.champ;
  const nbChanges = bloc.champs.filter((c) => c.lire() !== originaux[c.cle]).length;
  const autresTextes = absents.filter((c) => c.type !== 'image');

  return (
    <div data-edition className={styles.edition} onKeyDown={surTouche}>
      <div ref={barre} className={styles.barre} role="group" aria-label={t.barre(bloc.titre)}>
        <p className={styles.barreTitre}>
          {t.barre(bloc.titre)}
          <span className={styles.barreAide}>{nbChanges > 0 ? t.changements(nbChanges) : t.aide}</span>
        </p>
        <div className={styles.barreActions}>
          {autresTextes.length > 0 && (
            <button type="button" className={buttonClassName({ variant: 'ghost' })} aria-expanded={autres} onClick={() => setAutres((a) => !a)}>
              {t.autres(autresTextes.length)}
            </button>
          )}
          <button type="button" className={buttonClassName({ variant: 'secondary' })} onClick={annuler} disabled={envoi}>
            {t.annuler}
          </button>
          <button type="button" className={buttonClassName()} onClick={() => void enregistrer()} disabled={envoi || imageEnCours}>
            {envoi ? t.envoi : t.enregistrer}
          </button>
        </div>
        {erreur && (
          <p className={styles.erreur} role="alert">
            {erreur}
          </p>
        )}
        {autres && (
          <div className={styles.autres}>
            {autresTextes.map((c) => (
              <TextField
                key={c.cle}
                label={c.libelle}
                multiline={c.type === 'long' ? true : undefined}
                defaultValue={c.lire()}
                onBlur={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  if (e.target.value !== c.lire()) appliquer(c, e.target.value);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {cibles.map((cible, i) => (
        <button
          key={`${cible.champ.cle}-${i}`}
          ref={(el) => {
            boutons.current[i] = el;
          }}
          type="button"
          className={cible.champ.type === 'image' ? `${styles.cible} ${styles.cibleImage}` : styles.cible}
          style={{ top: cible.haut - 3, left: cible.gauche - 4, width: cible.largeur + 8, height: cible.hauteur + 6 }}
          aria-label={t.modifierChamp(cible.champ.libelle)}
          title={t.modifierChamp(cible.champ.libelle)}
          onClick={() => ouvrir(cible, i)}
        />
      ))}

      {actif && champActif && (
        <form
          className={styles.bulle}
          style={{ top: actif.cible.haut + actif.cible.hauteur + 8, left: Math.max(actif.cible.gauche, 0) }}
          onSubmit={valider}
          noValidate
          aria-label={t.modifierChamp(champActif.libelle)}
        >
          {champActif.type === 'image' ? (
            <label className={buttonClassName({ variant: 'secondary' })}>
              {imageEnCours ? t.envoiImage : t.changerImage}
              <span className="sr-only"> : {champActif.libelle}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={styles.fichier}
                disabled={imageEnCours}
                onChange={(e) => void choisirImage(champActif, e)}
              />
            </label>
          ) : (
            <TextField
              label={champActif.libelle}
              multiline={champActif.type === 'long' ? true : undefined}
              rows={champActif.type === 'long' ? 4 : undefined}
              inputMode={champActif.type === 'prix' ? 'numeric' : undefined}
              autoFocus
              value={saisie}
              onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSaisie(e.target.value)}
            />
          )}
          {erreurBulle && (
            <p className={styles.erreur} role="alert">
              {erreurBulle}
            </p>
          )}
          <div className={styles.bulleActions}>
            {champActif.type !== 'image' && (
              <button type="submit" className={buttonClassName()}>
                {t.valider}
              </button>
            )}
            <button type="button" className={buttonClassName({ variant: 'ghost' })} onClick={fermerBulle}>
              {t.fermer}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
