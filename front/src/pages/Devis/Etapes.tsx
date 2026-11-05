import { ChoiceChips, OptionCard, TextField } from '@bsandoz79/blocs';
import { besoins, budgets, delais, devisTextes, limitesPhotos } from '../../data/devis';
import { metiers } from '../../data/offres';
import type { Demande, Erreurs } from './demande';
import styles from './Devis.module.css';

export type EtapeProps = {
  demande: Demande;
  erreurs: Erreurs;
  maj: (champ: Partial<Demande>) => void;
};

const t = devisTextes;

function Erreur({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className={styles.erreur}>
      {message}
    </p>
  ) : null;
}

export function EtapeActivite({ demande, erreurs, maj }: EtapeProps) {
  return (
    <>
      <ChoiceChips
        legend={t.activite.legende}
        hideLegend
        name="devis-activite"
        choices={metiers.map((m) => ({ value: m.id, label: m.nom }))}
        value={demande.metier}
        onChange={(metier) => maj({ metier })}
      />
      <Erreur id="erreur-metier" message={erreurs.metier} />
    </>
  );
}

export function EtapeBesoins({ demande, erreurs, maj }: EtapeProps) {
  return (
    <fieldset className={styles.fieldset} aria-describedby={erreurs.besoins ? 'erreur-besoins' : undefined}>
      <legend className="sr-only">{t.besoins.legende}</legend>
      <ul className={styles.grille}>
        {besoins.map((besoin) => (
          <li key={besoin.id}>
            <OptionCard
              title={besoin.nom}
              description={besoin.description}
              checked={demande.besoins.includes(besoin.id)}
              onChange={(coche) =>
                maj({ besoins: coche ? [...demande.besoins, besoin.id] : demande.besoins.filter((b) => b !== besoin.id) })
              }
            />
          </li>
        ))}
      </ul>
      <Erreur id="erreur-besoins" message={erreurs.besoins} />
    </fieldset>
  );
}

type PropsMots = EtapeProps & { photos: File[]; setPhotos: (photos: File[]) => void };

export function EtapeMots({ demande, erreurs, maj, photos, setPhotos }: PropsMots) {
  return (
    <div className={styles.champs}>
      <TextField
        label={t.mots.description}
        multiline
        rows={7}
        required
        value={demande.description}
        onChange={(e) => maj({ description: e.target.value })}
        error={erreurs.description}
        maxLength={5000}
      />
      <TextField
        label={t.mots.lien}
        hint={t.mots.lienAide}
        type="url"
        inputMode="url"
        placeholder="https://"
        value={demande.lien}
        onChange={(e) => maj({ lien: e.target.value })}
        error={erreurs.lien}
      />
      <div className={styles.fichiers}>
        <label htmlFor="devis-photos" className={styles.label}>
          {t.mots.photos}
        </label>
        <p id="devis-photos-aide" className={styles.aide}>
          {t.mots.photosAide(limitesPhotos.nombre, limitesPhotos.tailleMo)}
        </p>
        <input
          id="devis-photos"
          type="file"
          multiple
          accept={limitesPhotos.types.join(',')}
          aria-describedby={['devis-photos-aide', erreurs.photos ? 'erreur-photos' : ''].filter(Boolean).join(' ')}
          aria-invalid={erreurs.photos ? true : undefined}
          onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
        />
        {photos.length > 0 && (
          <ul className={styles.listePhotos}>
            {photos.map((photo) => (
              <li key={photo.name}>{photo.name}</li>
            ))}
          </ul>
        )}
        <Erreur id="erreur-photos" message={erreurs.photos} />
      </div>
    </div>
  );
}

export function EtapeBudget({ demande, erreurs, maj }: EtapeProps) {
  return (
    <div className={styles.champs}>
      <div>
        <ChoiceChips
          legend={t.budget.budget}
          name="devis-budget"
          choices={budgets}
          value={demande.budget}
          onChange={(budget) => maj({ budget })}
        />
        <Erreur id="erreur-budget" message={erreurs.budget} />
      </div>
      <div>
        <ChoiceChips
          legend={t.budget.delai}
          name="devis-delai"
          choices={delais}
          value={demande.delai}
          onChange={(delai) => maj({ delai })}
        />
        <Erreur id="erreur-delai" message={erreurs.delai} />
      </div>
    </div>
  );
}
