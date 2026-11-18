import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Autocomplete, Button, ChoiceChips, Container, TextField } from '@bsandoz79/blocs';
import { urlEnvoiDevis } from '../../data/devis';
import {
  construireEnvoiMaquette,
  demandeVide,
  maquette as t,
  validerMaquette,
  type DemandeMaquette,
  type ErreursMaquette,
  type Objectif,
  type Style,
} from '../../data/maquette';
import { nomsMetiers } from '../../data/metiersConnus';
import styles from './MaquetteGratuite.module.css';

/** Un envoi par minute depuis le même navigateur (le serveur limite aussi). */
const DELAI_MS = 60_000;

/** Formulaire « maquette gratuite de votre page d'accueil » : quelques questions, réponse par e-mail sous 72 h ouvrées. */
export function MaquetteGratuite() {
  const [demande, setDemande] = useState<DemandeMaquette>(demandeVide);
  const [erreurs, setErreurs] = useState<ErreursMaquette>({});
  const [statut, setStatut] = useState<'saisie' | 'envoi' | 'envoye' | 'echec' | 'trop-rapide'>('saisie');
  const [piege, setPiege] = useState('');
  const [dernierEnvoi, setDernierEnvoi] = useState(0);

  const maj = (champ: Partial<DemandeMaquette>) => {
    setDemande((d) => ({ ...d, ...champ }));
    setErreurs((e) => {
      const reste = { ...e };
      for (const cle of Object.keys(champ)) delete reste[cle as keyof DemandeMaquette];
      return reste;
    });
  };

  async function envoyer(event: FormEvent) {
    event.preventDefault();
    const trouvees = validerMaquette(demande);
    setErreurs(trouvees);
    if (Object.keys(trouvees).length > 0) return;
    if (Date.now() - dernierEnvoi < DELAI_MS) {
      setStatut('trop-rapide');
      return;
    }
    setStatut('envoi');
    try {
      const reponse = await fetch(urlEnvoiDevis, { method: 'POST', body: construireEnvoiMaquette(demande, piege) });
      if (reponse.status === 429) {
        setStatut('trop-rapide');
        return;
      }
      if (!reponse.ok) throw new Error('Refusé');
      setDernierEnvoi(Date.now());
      setStatut('envoye');
    } catch {
      setStatut('echec');
    }
  }

  return (
    <section className="section section--white" aria-labelledby="maquette-titre">
      <Container className={styles.pile}>
        <div className={styles.entete}>
          <h2 id="maquette-titre" className={styles.titre}>
            {t.titre}
          </h2>
          <p className={styles.intro}>{t.intro}</p>
        </div>

        {statut === 'envoye' ? (
          <div className={styles.merci} role="status">
            <p className={styles.merciTitre}>{t.envoye.titre}</p>
            <p>{t.envoye.texte}</p>
          </div>
        ) : (
          <form className={styles.formulaire} onSubmit={envoyer} noValidate aria-labelledby="maquette-titre">
            <div className={styles.deux}>
              <TextField label={t.nom} required autoComplete="name" value={demande.nom} error={erreurs.nom} onChange={(e) => maj({ nom: e.target.value })} />
              <TextField label={t.entreprise} autoComplete="organization" value={demande.entreprise} onChange={(e) => maj({ entreprise: e.target.value })} />
            </div>
            <div className={styles.deux}>
              <Autocomplete
                label={t.activite}
                placeholder={t.activiteAide}
                required
                maxLength={80}
                suggestions={nomsMetiers}
                value={demande.activite}
                error={erreurs.activite}
                onChange={(activite) => maj({ activite })}
              />
              <TextField label={t.ville} required autoComplete="address-level2" value={demande.ville} error={erreurs.ville} onChange={(e) => maj({ ville: e.target.value })} />
            </div>
            <TextField
              label={t.description}
              placeholder={t.descriptionAide}
              multiline
              rows={3}
              required
              value={demande.description}
              error={erreurs.description}
              onChange={(e) => maj({ description: e.target.value })}
            />
            <ChoiceChips<Objectif>
              legend={t.objectif.legende}
              name="maquette-objectif"
              choices={t.objectif.choix}
              value={demande.objectif}
              onChange={(objectif) => maj({ objectif })}
            />
            <ChoiceChips<Style>
              legend={t.style.legende}
              name="maquette-style"
              choices={t.style.choix}
              value={demande.style}
              onChange={(style) => maj({ style })}
            />
            <TextField label={t.siteActuel} type="url" inputMode="url" autoComplete="url" value={demande.siteActuel} onChange={(e) => maj({ siteActuel: e.target.value })} />
            <div className={styles.deux}>
              <TextField label={t.email} type="email" required autoComplete="email" value={demande.email} error={erreurs.email} onChange={(e) => maj({ email: e.target.value })} />
              <TextField label={t.telephone} type="tel" autoComplete="tel" value={demande.telephone} error={erreurs.telephone} onChange={(e) => maj({ telephone: e.target.value })} />
            </div>

            {/* Champ piège anti-robots : invisible et ignoré par les lecteurs d'écran. */}
            <div className={styles.piege} aria-hidden="true">
              <label htmlFor="maquette-site-web">Site web</label>
              <input id="maquette-site-web" tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} />
            </div>

            <div className={styles.consentement}>
              <input
                id="maquette-consentement"
                type="checkbox"
                checked={demande.consentement}
                onChange={(e) => maj({ consentement: e.target.checked })}
                aria-invalid={erreurs.consentement ? true : undefined}
                aria-describedby={erreurs.consentement ? 'maquette-consentement-erreur' : undefined}
              />
              <label htmlFor="maquette-consentement">
                {t.consentement} <Link to={t.confidentialite.to}>{t.confidentialite.label}</Link>
              </label>
            </div>
            {erreurs.consentement && (
              <p id="maquette-consentement-erreur" className={styles.erreur}>
                {erreurs.consentement}
              </p>
            )}

            {(statut === 'echec' || statut === 'trop-rapide') && (
              <p className={styles.alerte} role="alert">
                {statut === 'echec' ? t.echec : t.tropRapide}
              </p>
            )}

            <Button type="submit" size="lg" className={styles.envoyer} disabled={statut === 'envoi'}>
              {statut === 'envoi' ? t.envoi : t.envoyer}
            </Button>
          </form>
        )}
      </Container>
    </section>
  );
}
