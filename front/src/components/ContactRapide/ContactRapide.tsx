import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Autocomplete, Button, ChoiceChips, Container, TextField } from '@bsandoz79/blocs';
import { contactRapide } from '../../data/contact';
import { nomsMetiers } from '../../data/metiersConnus';
import { urlEnvoiDevis } from '../../data/devis';
import { contact } from '../../data/navigation';
import {
  construireEnvoiContact,
  messageVide,
  validerContact,
  type ErreursContact,
  type MessageContact,
  type StyleMaquette,
  type TypeDemande,
} from './contact';
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
  /** Texte d'introduction, celui des données par défaut. */
  intro?: string;
};

/** Formulaire de contact, en carte : le formulaire à gauche, les autres moyens de contact à droite. */
export function ContactRapide({ titre = t.titre, niveau = 2, intro = t.intro }: ContactRapideProps) {
  const [message, setMessage] = useState<MessageContact>(messageVide);
  const [erreurs, setErreurs] = useState<ErreursContact>({});
  const [statut, setStatut] = useState<'saisie' | 'envoi' | 'envoye' | 'echec' | 'trop-rapide'>('saisie');
  const [piege, setPiege] = useState('');
  const [dernierEnvoi, setDernierEnvoi] = useState(0);
  const Titre = `h${niveau}` as const;
  const maquette = message.demande === 'maquette';
  const envoye = maquette ? t.maquette.envoye : t.envoye;

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
    const trouvees = validerContact(message);
    setErreurs(trouvees);
    if (Object.keys(trouvees).length > 0) return;
    if (Date.now() - dernierEnvoi < DELAI_MS) {
      setStatut('trop-rapide');
      return;
    }
    setStatut('envoi');
    try {
      const reponse = await fetch(urlEnvoiDevis, { method: 'POST', body: construireEnvoiContact(message, piege) });
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
        </div>

        <div className={styles.carte}>
          {statut === 'envoye' ? (
            <div className={styles.merci} role="status">
              <p className={styles.merciTitre}>{envoye.titre}</p>
              <p>{envoye.texte}</p>
            </div>
          ) : (
            <form className={styles.formulaire} onSubmit={envoyer} noValidate aria-labelledby="contact-rapide-titre">
              <ChoiceChips<TypeDemande>
                legend={t.demande.legende}
                name="contact-demande"
                choices={t.demande.choix}
                value={message.demande}
                onChange={(demande) => maj({ demande })}
              />
              {maquette && <p className={styles.aide}>{t.maquette.aide}</p>}
              <div className={styles.deux}>
                <TextField label={t.nom} required autoComplete="name" value={message.nom} error={erreurs.nom} onChange={(e) => maj({ nom: e.target.value })} />
                <TextField label={t.entreprise} autoComplete="organization" value={message.entreprise} onChange={(e) => maj({ entreprise: e.target.value })} />
              </div>
              <div className={styles.deux}>
                <TextField label={t.email} type="email" required autoComplete="email" value={message.email} error={erreurs.email} onChange={(e) => maj({ email: e.target.value })} />
                <TextField
                  label={maquette ? t.maquette.telephone : t.telephone}
                  type="tel"
                  required={!maquette}
                  autoComplete="tel"
                  value={message.telephone}
                  error={erreurs.telephone}
                  onChange={(e) => maj({ telephone: e.target.value })}
                />
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
              {maquette && (
                <TextField label={t.maquette.ville} required autoComplete="address-level2" value={message.ville} error={erreurs.ville} onChange={(e) => maj({ ville: e.target.value })} />
              )}
              <TextField
                label={maquette ? t.maquette.projet : t.projet}
                placeholder={maquette ? t.maquette.projetAide : t.projetAide}
                multiline
                rows={4}
                required
                value={message.projet}
                error={erreurs.projet}
                onChange={(e) => maj({ projet: e.target.value })}
              />

              {maquette && (
                <ChoiceChips<StyleMaquette>
                  legend={t.maquette.style.legende}
                  name="contact-style"
                  choices={t.maquette.style.choix}
                  value={message.style}
                  onChange={(style) => maj({ style })}
                />
              )}

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
                {statut === 'envoi' ? t.envoi : maquette ? t.maquette.envoyer : t.envoyer}
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
