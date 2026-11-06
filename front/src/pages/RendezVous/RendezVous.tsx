import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Calendar, ChoiceChips, Container, TextField, aujourdhui, buttonClassName, debutDuMois, libelleLong } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { pages } from '../../data/pages';
import { lieux, rdvTextes, type LieuId } from '../../data/rendezvous';
import {
  bornes,
  corpsReservation,
  actualiserDisponibilites,
  creneauxDuJour,
  demandeRdvVide,
  etapesRdv,
  jourDisponible,
  urlApi,
  validerRdv,
  verifierAdresse,
  type DemandeRdv,
  type ErreursRdv,
  type ResultatAdresse,
} from './reservation';
import { aDistance, formatFrais, kmFactures } from '../../data/zones';
import styles from './RendezVous.module.css';
import { useCentrerEtape } from './useCentrerEtape';

const t = rdvTextes;
type Statut = 'saisie' | 'envoi' | 'confirme' | 'echec' | 'complet';

function messageAdresse(resultat: ResultatAdresse) {
  if (resultat.statut === 'ok') return t.adresse.ok(resultat.ville, aDistance(resultat.km, resultat.base));
  if (resultat.statut === 'hors-zone')
    return t.adresse.horsZone(resultat.ville, aDistance(resultat.km, resultat.base), kmFactures(resultat.km), formatFrais(resultat.frais));
  return resultat.statut === 'introuvable' ? t.adresse.introuvable : t.adresse.erreur;
}

/** Rendez-vous découverte gratuit : lieu, créneau d'une heure, coordonnées, confirmation. */
export function RendezVous() {
  const [jourCourant] = useState(() => aujourdhui());
  const { min, max } = bornes(jourCourant);
  const [demande, setDemande] = useState<DemandeRdv>(demandeRdvVide);
  const [mois, setMois] = useState(() => debutDuMois(min));
  const [verification, setVerification] = useState<ResultatAdresse | null>(null);
  const [verificationEnCours, setVerificationEnCours] = useState(false);
  const [erreurs, setErreurs] = useState<ErreursRdv>({});
  const [statut, setStatut] = useState<Statut>('saisie');
  const etapes = etapesRdv(demande, verification);
  const refCreneau = useRef<HTMLFieldSetElement>(null);
  const refCoordonnees = useRef<HTMLFieldSetElement>(null);
  useCentrerEtape(etapes.creneau, refCreneau);
  useCentrerEtape(etapes.coordonnees, refCoordonnees);

  const maj = (champ: Partial<DemandeRdv>) => {
    setDemande((d) => ({ ...d, ...champ }));
    setErreurs((e) => {
      const reste = { ...e };
      for (const cle of Object.keys(champ)) delete reste[cle as keyof ErreursRdv];
      return reste;
    });
  };

  async function verifier(): Promise<ResultatAdresse | null> {
    if (demande.lieu !== 'chezvous' || !demande.adresse.trim()) return null;
    setVerificationEnCours(true);
    const resultat = await verifierAdresse(demande.adresse);
    setVerification(resultat);
    setVerificationEnCours(false);
    return resultat;
  }

  // Le calendrier se redessine quand les vraies disponibilités arrivent.
  const [, setDisponibilitesChargees] = useState(false);
  useEffect(() => {
    let actif = true;
    void actualiserDisponibilites().then((ok) => actif && ok && setDisponibilitesChargees(true));
    return () => {
      actif = false;
    };
  }, []);

  async function confirmer(event: FormEvent) {
    event.preventDefault();
    // Adresse pas encore vérifiée : on la vérifie (frais éventuels affichés), sans bloquer l'envoi.
    if (demande.lieu === 'chezvous' && !verification) await verifier();
    const trouvees = validerRdv(demande);
    setErreurs(trouvees);
    if (Object.keys(trouvees).length > 0) return;
    setStatut('envoi');
    try {
      const reponse = await fetch(`${urlApi}/rendez-vous`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpsReservation(demande)),
      });
      if (reponse.status === 409) {
        setStatut('complet');
        maj({ creneau: null });
        return;
      }
      if (!reponse.ok) throw new Error('Refusé');
      setStatut('confirme');
    } catch {
      setStatut('echec');
    }
  }

  if (statut === 'confirme') {
    return (
      <>
        <PageMeta title={pages.rendezVous.title} description={pages.rendezVous.description} />
        <Container size="narrow" className={styles.confirme}>
          <h1 className={styles.titre}>{t.confirme.titre}</h1>
          <p className={styles.aide}>{t.confirme.texte}</p>
          <Link to={t.confirme.accueil.to} className={buttonClassName({ className: styles.retour })}>
            {t.confirme.accueil.label}
          </Link>
        </Container>
      </>
    );
  }

  const creneaux = creneauxDuJour(demande.jour, jourCourant);
  const annonce = etapes.coordonnees ? t.etapes.coordonnees : etapes.creneau ? t.etapes.creneau : '';
  const lieu = lieux.find((l) => l.id === demande.lieu)!;
  const nbErreurs = Object.keys(erreurs).length;
  const lieuResume =
    demande.lieu === 'chezvous' && (verification?.statut === 'ok' || verification?.statut === 'hors-zone')
      ? `${lieu.nom}, ${verification.ville}`
      : lieu.nom;

  return (
    <>
      <PageMeta title={pages.rendezVous.title} description={pages.rendezVous.description} />
      <Container className={styles.page}>
        <section className={styles.choix} aria-labelledby="rdv-titre">
          <h1 id="rdv-titre" className={styles.titre}>
            {t.choix.titre}
          </h1>
          <ul className={styles.options}>
            <li>
              <Link to={t.choix.enLigne.to} className={styles.option}>
                <strong>{t.choix.enLigne.titre}</strong>
                <span>{t.choix.enLigne.texte}</span>
              </Link>
            </li>
            <li>
              <p className={`${styles.option} ${styles.optionActive}`} aria-current="true">
                <strong>{t.choix.voix.titre}</strong>
                <span>{t.choix.voix.texte}</span>
              </p>
            </li>
          </ul>
        </section>

        <div className={styles.colonnes}>
          <form id="rdv-formulaire" className={styles.formulaire} onSubmit={confirmer} noValidate aria-label={t.resume.nom}>
            {nbErreurs > 0 && (
              <p className={styles.alerte} role="alert">
                {t.erreurs.resume(nbErreurs)}
              </p>
            )}

            <div className={styles.bloc}>
              <ChoiceChips<LieuId>
                legend={<span className={styles.legende}>{t.lieu.legende}</span>}
                name="rdv-lieu"
                variant="cards"
                choices={lieux.map((l) => ({ value: l.id, label: l.nom, description: l.description }))}
                value={demande.lieu}
                onChange={(lieuChoisi) => maj({ lieu: lieuChoisi })}
              />
              {demande.lieu === 'chezvous' && (
                <div className={styles.adresse}>
                  <TextField
                    label={t.adresse.label}
                    hint={t.adresse.aide}
                    autoComplete="street-address"
                    required
                    value={demande.adresse}
                    onChange={(e) => {
                      maj({ adresse: e.target.value });
                      setVerification(null);
                    }}
                    onBlur={() => void verifier()}
                    error={erreurs.adresse}
                  />
                  {!verification && (
                    <Button
                      variant="secondary"
                      className={styles.verifier}
                      disabled={verificationEnCours || !demande.adresse.trim()}
                      onClick={() => void verifier()}
                    >
                      {t.adresse.verifier}
                    </Button>
                  )}
                  <p className={styles.statutAdresse} role="status">
                    {verificationEnCours
                      ? t.adresse.verification
                      : verification && (
                          <span className={verification.statut === 'ok' ? styles.ok : styles.attention}>
                            {verification.statut === 'ok' ? '✓ ' : ''}
                            {messageAdresse(verification)}
                          </span>
                        )}
                  </p>
                  <p className={styles.aide}>{t.adresse.limite}</p>
                </div>
              )}
            </div>

            <p className="sr-only" aria-live="polite">
              {annonce}
            </p>

            {etapes.creneau && (
              <fieldset ref={refCreneau} className={`${styles.bloc} anim-appear`}>
                <legend className={styles.legende}>{t.creneau.legende}</legend>
                <div className={styles.creneaux}>
                  <div>
                    <Calendar
                      label={t.creneau.calendrier}
                      month={mois}
                      onMonthChange={setMois}
                      value={demande.jour}
                      onChange={(jour) => maj({ jour, creneau: null })}
                      isDisabled={(jour) => !jourDisponible(jour, jourCourant)}
                      min={min}
                      max={max}
                      today={jourCourant}
                    />
                    <p className={styles.aide}>{t.creneau.legendeJours}</p>
                    {erreurs.jour && <p className={styles.erreur}>{erreurs.jour}</p>}
                  </div>
                  <div>
                    {demande.jour ? (
                      <ChoiceChips
                        legend={t.creneau.creneauxDu(libelleLong(demande.jour))}
                        name="rdv-creneau"
                        choices={creneaux.map((c) => ({ value: c.debut, label: c.libelle }))}
                        value={demande.creneau}
                        onChange={(creneau) => maj({ creneau })}
                      />
                    ) : (
                      <p className={styles.aide}>{t.creneau.choisirJour}</p>
                    )}
                    {erreurs.creneau && <p className={styles.erreur}>{erreurs.creneau}</p>}
                    <p className={styles.aide}>{t.creneau.trajet}</p>
                  </div>
                </div>
              </fieldset>
            )}

            {etapes.coordonnees && (
              <fieldset ref={refCoordonnees} className={`${styles.bloc} anim-appear`}>
                <legend className={styles.legende}>{t.coordonnees.legende}</legend>
                <div className={styles.champs}>
                  <TextField label={t.coordonnees.nom} required autoComplete="name" value={demande.nom} onChange={(e) => maj({ nom: e.target.value })} error={erreurs.nom} />
                  <TextField label={t.coordonnees.telephone} type="tel" required autoComplete="tel" value={demande.telephone} onChange={(e) => maj({ telephone: e.target.value })} error={erreurs.telephone} />
                  <TextField label={t.coordonnees.email} type="email" required autoComplete="email" value={demande.email} onChange={(e) => maj({ email: e.target.value })} error={erreurs.email} />
                  <TextField label={t.coordonnees.activite} autoComplete="organization-title" value={demande.activite} onChange={(e) => maj({ activite: e.target.value })} />
                </div>
                <TextField
                  label={t.coordonnees.message}
                  hint={t.coordonnees.messageAide}
                  multiline
                  rows={3}
                  value={demande.message}
                  onChange={(e) => maj({ message: e.target.value })}
                />
                <div className={styles.consentement}>
                  <input
                    id="rdv-consentement"
                    type="checkbox"
                    checked={demande.consentement}
                    onChange={(e) => maj({ consentement: e.target.checked })}
                    aria-invalid={erreurs.consentement ? true : undefined}
                    aria-describedby={erreurs.consentement ? 'rdv-erreur-consentement' : undefined}
                  />
                  <label htmlFor="rdv-consentement">
                    {t.coordonnees.consentement} <Link to={t.coordonnees.confidentialite.to}>{t.coordonnees.confidentialite.label}</Link>
                  </label>
                </div>
                {erreurs.consentement && (
                  <p id="rdv-erreur-consentement" className={styles.erreur}>
                    {erreurs.consentement}
                  </p>
                )}
              </fieldset>
            )}

            {(statut === 'echec' || statut === 'complet') && (
              <div className={styles.alerte} role="alert">
                <p className={styles.alerteTitre}>{t.echec.titre}</p>
                <p>{statut === 'complet' ? t.echec.complet : t.echec.texte}</p>
              </div>
            )}
          </form>

          <aside className={styles.resume} aria-label={t.resume.titre}>
            <div className={styles.carte}>
              <p className={styles.badge}>{t.resume.badge}</p>
              <p className={styles.nom}>{t.resume.nom}</p>
              <dl className={styles.liste}>
                <div>
                  <dt>{t.resume.date}</dt>
                  <dd>{demande.jour ? libelleLong(demande.jour) : t.resume.vide}</dd>
                </div>
                <div>
                  <dt>{t.resume.heure}</dt>
                  <dd>{creneaux.find((c) => c.debut === demande.creneau)?.libelle ?? t.resume.vide}</dd>
                </div>
                <div>
                  <dt>{t.resume.lieu}</dt>
                  <dd>{lieuResume}</dd>
                </div>
              </dl>
              {etapes.coordonnees ? (
                <Button type="submit" form="rdv-formulaire" size="lg" block disabled={statut === 'envoi'}>
                  {statut === 'envoi' ? t.resume.envoi : t.resume.confirmer}
                </Button>
              ) : (
                <p className={styles.note}>{t.resume.aCompleter}</p>
              )}
              <p className={styles.note}>{t.resume.note}</p>
            </div>
            <div className={styles.pendant}>
              <p className={styles.pendantTitre}>{t.resume.pendant.titre}</p>
              <ul>
                {t.resume.pendant.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
