import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Autocomplete, Button, Container, TextField } from '@bsandoz79/blocs';
import { contactRapide } from '../../data/contact';
import { nomsMetiers } from '../../data/metiersConnus';
import { urlEnvoiDevis } from '../../data/devis';
import { contact, lienEstimation } from '../../data/navigation';
import { construireEnvoiContact, messageVide, validerContact, type ErreursContact, type EstimationJointe, type MessageContact } from './contact';
import { BoutonRdv } from '../BoutonRdv';
import styles from './ContactRapide.module.css';

const t = contactRapide;
/** Un envoi par minute depuis le même navigateur (le serveur limite aussi). */
const DELAI_MS = 60_000;
/** Suggestions du champ « métier » : les métiers connus, et les particuliers (informatique sur place). */
const SUGGESTIONS = [...nomsMetiers, 'Particulier'];

type ContactRapideProps = {
  /** Titre de la section : celui des données par défaut. */
  titre?: string;
  /** 1 sur la page « Demande de devis », 2 en bas de l'accueil. */
  niveau?: 1 | 2;
  /** Estimation validée : jointe à la demande, le projet devient facultatif. */
  estimation?: EstimationJointe;
  /** Texte d'introduction, celui des données par défaut. */
  intro?: string;
  /** Propose l'estimation en ligne sous l'introduction (page Devis). */
  avecEstimation?: boolean;
};

/** Formulaire de contact, en carte : le formulaire à gauche, les autres moyens de contact à droite. */
export function ContactRapide({ titre = t.titre, niveau = 2, estimation, intro = t.intro, avecEstimation = false }: ContactRapideProps) {
  const [message, setMessage] = useState<MessageContact>(() => ({ ...messageVide, activite: estimation?.activite ?? '' }));
  const [erreurs, setErreurs] = useState<ErreursContact>({});
  const [statut, setStatut] = useState<'saisie' | 'envoi' | 'envoye' | 'echec' | 'trop-rapide'>('saisie');
  const [piege, setPiege] = useState('');
  const [dernierEnvoi, setDernierEnvoi] = useState(0);
  const Titre = `h${niveau}` as const;

  const maj = (champ: Partial<MessageContact>) => {
    setMessage((m) => ({ ...m, ...champ }));
    setErreurs((e) => {
      const reste = { ...e };
      for (const cle of Object.keys(champ)) delete reste[cle as keyof MessageContact];
      return reste;
    });
  };

  async function envoyer(event: FormEvent) {
    event.preventDefault();
    const trouvees = validerContact(message, Boolean(estimation));
    setErreurs(trouvees);
    if (Object.keys(trouvees).length > 0) return;
    if (Date.now() - dernierEnvoi < DELAI_MS) {
      setStatut('trop-rapide');
      return;
    }
    setStatut('envoi');
    try {
      const reponse = await fetch(urlEnvoiDevis, { method: 'POST', body: construireEnvoiContact(message, piege, estimation) });
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
    <section className={styles.section} aria-labelledby="contact-rapide-titre">
      <Container>
        <div className={styles.entete}>
          <Titre id="contact-rapide-titre" className={styles.titre}>
            {titre}
          </Titre>
          <p className={styles.intro}>{intro}</p>
          {avecEstimation && (
            <p className={styles.estimer}>
              {t.estimer.texte} <Link to={lienEstimation}>{t.estimer.label}</Link>
            </p>
          )}
        </div>

        <div className={styles.carte}>
          {statut === 'envoye' ? (
            <div className={styles.merci} role="status">
              <p className={styles.merciTitre}>{t.envoye.titre}</p>
              <p>{t.envoye.texte}</p>
            </div>
          ) : (
            <form className={styles.formulaire} onSubmit={envoyer} noValidate aria-labelledby="contact-rapide-titre">
              {estimation && (
                <div className={styles.estimation}>
                  <p className={styles.estimationTitre}>{t.estimation}</p>
                  <dl className={styles.estimationListe}>
                    {estimation.lignes.map(([cle, valeur]) => (
                      <div key={cle}>
                        <dt>{cle}</dt>
                        <dd>{valeur}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              <div className={styles.deux}>
                <TextField label={t.nom} required autoComplete="name" value={message.nom} error={erreurs.nom} onChange={(e) => maj({ nom: e.target.value })} />
                <TextField label={t.entreprise} autoComplete="organization" value={message.entreprise} onChange={(e) => maj({ entreprise: e.target.value })} />
              </div>
              <div className={styles.deux}>
                <TextField label={t.email} type="email" required autoComplete="email" value={message.email} error={erreurs.email} onChange={(e) => maj({ email: e.target.value })} />
                <TextField label={t.telephone} type="tel" required autoComplete="tel" value={message.telephone} error={erreurs.telephone} onChange={(e) => maj({ telephone: e.target.value })} />
              </div>
              <Autocomplete
                label={t.activite}
                placeholder={t.activiteAide}
                required
                maxLength={80}
                suggestions={SUGGESTIONS}
                announce={t.suggestions}
                value={message.activite}
                error={erreurs.activite}
                onChange={(activite) => maj({ activite })}
              />
              <TextField
                label={estimation ? t.precision : t.projet}
                placeholder={t.projetAide}
                multiline
                rows={estimation ? 3 : 4}
                required={!estimation}
                value={message.projet}
                error={erreurs.projet}
                onChange={(e) => maj({ projet: e.target.value })}
              />

              {/* Champ piège anti-robots : invisible et ignoré par les lecteurs d'écran. */}
              <div className={styles.piege} aria-hidden="true">
                <label htmlFor="contact-site-web">Site web</label>
                <input id="contact-site-web" tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} />
              </div>

              <div className={styles.consentement}>
                <input
                  id="contact-consentement"
                  type="checkbox"
                  checked={message.consentement}
                  onChange={(e) => maj({ consentement: e.target.checked })}
                  aria-invalid={erreurs.consentement ? true : undefined}
                  aria-describedby={erreurs.consentement ? 'contact-consentement-erreur' : undefined}
                />
                <label htmlFor="contact-consentement">
                  {t.consentement} <Link to={t.confidentialite.to}>{t.confidentialite.label}</Link>
                </label>
              </div>
              {erreurs.consentement && (
                <p id="contact-consentement-erreur" className={styles.erreur}>
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

          <aside className={styles.cote} aria-label={t.aCote.ecrire}>
            <a href={`mailto:${contact.email}`} className={styles.coordonnee}>
              <span className={styles.icone} aria-hidden="true">
                ✉
              </span>
              {contact.email}
            </a>
            {contact.phone && (
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className={styles.coordonnee}>
                <span className={styles.icone} aria-hidden="true">
                  ☎
                </span>
                {contact.phone}
              </a>
            )}
            <ul className={styles.promesses}>
              {t.aCote.promesses.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <BoutonRdv to={t.aCote.rendezVous.to} label={t.aCote.rendezVous.label} />
          </aside>
        </div>
      </Container>
    </section>
  );
}
