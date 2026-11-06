import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, TextField } from '@bsandoz79/blocs';
import { besoinsContact, contactRapide, type BesoinContact } from '../../data/contact';
import { urlEnvoiDevis } from '../../data/devis';
import { contact } from '../../data/navigation';
import { construireEnvoiContact, messageVide, validerContact, type ErreursContact, type MessageContact } from './contact';
import styles from './ContactRapide.module.css';

const t = contactRapide;
/** Un envoi par minute depuis le même navigateur (le serveur limite aussi). */
const DELAI_MS = 60_000;

/** Formulaire de contact rapide, en carte : le formulaire à gauche, les autres moyens de contact à droite. */
export function ContactRapide() {
  const [message, setMessage] = useState<MessageContact>(messageVide);
  const [erreurs, setErreurs] = useState<ErreursContact>({});
  const [statut, setStatut] = useState<'saisie' | 'envoi' | 'envoye' | 'echec' | 'trop-rapide'>('saisie');
  const [piege, setPiege] = useState('');
  const [dernierEnvoi, setDernierEnvoi] = useState(0);

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
          <h2 id="contact-rapide-titre" className={styles.titre}>
            {t.titre}
          </h2>
          <p className={styles.intro}>{t.intro}</p>
        </div>

        <div className={styles.carte}>
          {statut === 'envoye' ? (
            <div className={styles.merci} role="status">
              <p className={styles.merciTitre}>{t.envoye.titre}</p>
              <p>{t.envoye.texte}</p>
            </div>
          ) : (
            <form className={styles.formulaire} onSubmit={envoyer} noValidate aria-labelledby="contact-rapide-titre">
              <TextField label={t.nom} placeholder={t.nom} required autoComplete="name" value={message.nom} error={erreurs.nom} onChange={(e) => maj({ nom: e.target.value })} />
              <div className={styles.deux}>
                <TextField label={t.telephone} placeholder={t.telephone} type="tel" required autoComplete="tel" value={message.telephone} error={erreurs.telephone} onChange={(e) => maj({ telephone: e.target.value })} />
                <TextField label={t.email} placeholder={t.email} type="email" required autoComplete="email" value={message.email} error={erreurs.email} onChange={(e) => maj({ email: e.target.value })} />
              </div>
              <div className={styles.champ}>
                <label htmlFor="contact-besoin" className={styles.label}>
                  {t.besoin}
                  <span aria-hidden="true"> *</span>
                </label>
                <select
                  id="contact-besoin"
                  className={styles.select}
                  required
                  value={message.besoin}
                  onChange={(e) => maj({ besoin: e.target.value as BesoinContact })}
                  aria-invalid={erreurs.besoin ? true : undefined}
                  aria-describedby={erreurs.besoin ? 'contact-besoin-erreur' : undefined}
                >
                  <option value="">{t.choisir}</option>
                  {besoinsContact.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
                {erreurs.besoin && (
                  <p id="contact-besoin-erreur" className={styles.erreur}>
                    {erreurs.besoin}
                  </p>
                )}
              </div>
              <TextField label={t.projet} placeholder={t.projetAide} multiline rows={4} value={message.projet} onChange={(e) => maj({ projet: e.target.value })} />

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
            <Link to={t.aCote.rendezVous.to} className={styles.lienFort}>
              {t.aCote.rendezVous.label} →
            </Link>
            <Link to={t.aCote.devis.to} className={styles.lienDiscret}>
              {t.aCote.devis.label}
            </Link>
          </aside>
        </div>
      </Container>
    </section>
  );
}
