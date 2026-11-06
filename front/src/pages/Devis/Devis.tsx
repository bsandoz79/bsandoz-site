import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Stepper, TextField, buttonClassName } from '@bsandoz79/blocs';
import { verifierAdresse, type ResultatAdresse } from '../../app/adresse';
import { PageMeta } from '../../components/PageMeta';
import { besoins, devisTextes, etapesDevis, urlEnvoiDevis } from '../../data/devis';
import { nomActivite } from '../../data/offres';
import { pages } from '../../data/pages';
import { chargerEtat } from '../Composer/stockage';
import {
  DELAI_ENVOI_MS,
  chargerBrouillon,
  construireEnvoi,
  demandeRemiseAZero,
  demarrerDevis,
  effacerBrouillon,
  etapesActives,
  marqueZero,
  signatureEstimation,
  enregistrerBrouillon,
  lignesRecapitulatif,
  texteDeplacement,
  resumeConfiguration,
  validerEtape,
  type Demande,
  type Erreurs,
} from './demande';
import { EtapeActivite, EtapeBesoins, EtapeBudget, EtapeMots } from './Etapes';
import styles from './Devis.module.css';

const t = devisTextes;
const CLE_DERNIER_ENVOI = 'bsandoz.devis.dernierEnvoi';
const TITRES = [t.activite, t.besoins, t.mots, t.budget, t.coordonnees];

type Statut = 'saisie' | 'envoi' | 'envoye' | 'echec' | 'tropRapide';

function dernierEnvoi() {
  try {
    return Number(window.localStorage.getItem(CLE_DERNIER_ENVOI)) || 0;
  } catch {
    return 0;
  }
}

/** Parcours de demande de devis en 5 étapes, brouillon gardé dans le navigateur, envoi par e-mail. */
export function Devis() {
  // La dernière estimation (configurateur ou simulateur des Tarifs) pré-remplit le devis : voir `demarrerDevis`.
  const config = useMemo(() => chargerEtat().config, []);
  const [depart] = useState(() => demarrerDevis(chargerBrouillon(), config));
  const [demande, setDemande] = useState<Demande>(depart.demande);
  const [etape, setEtape] = useState(depart.etape);
  const [prerempli, setPrerempli] = useState(depart.prerempli);
  const [depuis, setDepuis] = useState(depart.depuis);
  // Devis parti d'une estimation : pas d'étape « Besoins », l'estimation dit déjà ce que le site doit faire.
  const actives = etapesActives(prerempli);
  const position = Math.max(actives.indexOf(etape), 0);
  const [photos, setPhotos] = useState<File[]>([]);
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [statut, setStatut] = useState<Statut>('saisie');
  const [piege, setPiege] = useState('');
  const [verification, setVerification] = useState<ResultatAdresse | null>(null);
  const [verificationEnCours, setVerificationEnCours] = useState(false);

  /** Vérifie l'adresse saisie : base la plus proche, distance et frais kilométriques. */
  async function verifier(): Promise<ResultatAdresse | null> {
    if (demande.adresse.trim().length < 3) return null;
    setVerificationEnCours(true);
    const resultat = await verifierAdresse(demande.adresse);
    setVerificationEnCours(false);
    setVerification(resultat);
    return resultat;
  }
  const titreRef = useRef<HTMLHeadingElement>(null);
  const premierRendu = useRef(true);

  useEffect(() => {
    if (statut !== 'envoye') enregistrerBrouillon(demande, etape, depuis);
  }, [demande, etape, statut, depuis]);

  function repartirDeZero() {
    setDemande(demandeRemiseAZero(demande));
    setErreurs({});
    setPrerempli(false);
    setDepuis(marqueZero(signatureEstimation(config)));
    setEtape(0);
  }

  // À chaque changement d'étape, le focus va sur le titre de l'étape (sauf au premier affichage).
  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    titreRef.current?.focus();
  }, [etape, statut]);

  const maj = (champ: Partial<Demande>) => {
    setDemande((d) => ({ ...d, ...champ }));
    setErreurs((e) => {
      const reste = { ...e };
      for (const cle of Object.keys(champ)) delete reste[cle as keyof Erreurs];
      return reste;
    });
  };

  const resume = resumeConfiguration(config);
  const derniere = position === actives.length - 1;

  async function envoyer() {
    if (Date.now() - dernierEnvoi() < DELAI_ENVOI_MS) {
      setStatut('tropRapide');
      return;
    }
    setStatut('envoi');
    try {
      // Adresse pas encore vérifiée : on la vérifie pour joindre l'estimation du déplacement.
      const controle = verification ?? (await verifier());
      const reponse = await fetch(urlEnvoiDevis, { method: 'POST', body: construireEnvoi(demande, config, photos, piege, controle) });
      if (reponse.status === 429) {
        setStatut('tropRapide');
        return;
      }
      const resultat = (await reponse.json().catch(() => ({}))) as { ok?: boolean };
      if (!reponse.ok || !resultat.ok) throw new Error('Envoi refusé');
      try {
        window.localStorage.setItem(CLE_DERNIER_ENVOI, String(Date.now()));
      } catch {
        // Stockage bloqué : la limite côté serveur suffit.
      }
      effacerBrouillon();
      setStatut('envoye');
    } catch {
      setStatut('echec');
    }
  }

  function suivant(event: FormEvent) {
    event.preventDefault();
    const trouvees = validerEtape(etape, demande, photos);
    setErreurs(trouvees);
    if (Object.keys(trouvees).length > 0) {
      titreRef.current?.focus();
      return;
    }
    if (derniere) void envoyer();
    else setEtape(actives[position + 1]);
  }

  if (statut === 'envoye') {
    return (
      <>
        <PageMeta title={pages.devis.title} description={pages.devis.description} />
        <Container size="narrow" className={styles.merci}>
          <h1 ref={titreRef} tabIndex={-1} className={styles.titre}>
            {t.envoye.titre}
          </h1>
          <p className={styles.aide}>{t.envoye.texte}</p>
          <div className={styles.actions}>
            <Link to={t.envoye.accueil.to} className={buttonClassName()}>
              {t.envoye.accueil.label}
            </Link>
            <Link to={t.envoye.rdv.to} className={buttonClassName({ variant: 'secondary' })}>
              {t.envoye.rdv.label}
            </Link>
          </div>
        </Container>
      </>
    );
  }

  const nbErreurs = Object.keys(erreurs).length;
  const proprietes = { demande, erreurs, maj };
  const metierNom = nomActivite(demande.metier, demande.metierAutre);

  return (
    <>
      <PageMeta title={pages.devis.title} description={pages.devis.description} />
      <Container className={styles.page}>
        <h1 className="sr-only">{pages.devis.heading}</h1>
        <Stepper label={t.progression} steps={actives.map((i) => etapesDevis[i])} current={position} />
        {prerempli && resume && (
          <div className={styles.reprise} role="status">
            <p>
              <strong>{t.reprise.titre}</strong> {resume.formule}
              {resume.options.length > 0 && ` · ${resume.options.join(', ')}`} ({resume.estimation}). {t.reprise.texte}
            </p>
            <button type="button" className={styles.zero} onClick={repartirDeZero}>
              {t.reprise.zero}
            </button>
          </div>
        )}

        <div className={styles.colonnes}>
          <form className={styles.formulaire} onSubmit={suivant} noValidate aria-labelledby="devis-etape-titre">
            <div className={styles.entete}>
              <p className={styles.compteur}>{t.etape(position + 1, actives.length)}</p>
              <h2 id="devis-etape-titre" ref={titreRef} tabIndex={-1} className={styles.titre}>
                {TITRES[etape].titre}
              </h2>
              {'aide' in TITRES[etape] && <p className={styles.aide}>{TITRES[etape].aide}</p>}
            </div>

            {nbErreurs > 0 && (
              <p className={styles.resumeErreurs} role="alert">
                {t.erreurs.resume(nbErreurs)}
              </p>
            )}

            {etape === 0 && <EtapeActivite {...proprietes} />}
            {etape === 1 && <EtapeBesoins {...proprietes} />}
            {etape === 2 && <EtapeMots {...proprietes} photos={photos} setPhotos={setPhotos} />}
            {etape === 3 && <EtapeBudget {...proprietes} />}
            {etape === 4 && (
              <div className={styles.champs}>
                <TextField
                  label={t.coordonnees.nom}
                  required
                  autoComplete="name"
                  value={demande.nom}
                  onChange={(e) => maj({ nom: e.target.value })}
                  error={erreurs.nom}
                />
                <TextField
                  label={t.coordonnees.entreprise}
                  autoComplete="organization"
                  value={demande.entreprise}
                  onChange={(e) => maj({ entreprise: e.target.value })}
                />
                <TextField
                  label={t.coordonnees.email}
                  type="email"
                  required
                  autoComplete="email"
                  value={demande.email}
                  onChange={(e) => maj({ email: e.target.value })}
                  error={erreurs.email}
                />
                <TextField
                  label={t.coordonnees.telephone}
                  type="tel"
                  autoComplete="tel"
                  value={demande.telephone}
                  onChange={(e) => maj({ telephone: e.target.value })}
                  error={erreurs.telephone}
                />
                <div className={styles.adresse}>
                  <TextField
                    label={t.coordonnees.adresse}
                    hint={t.coordonnees.adresseAide}
                    required
                    autoComplete="street-address"
                    value={demande.adresse}
                    onChange={(e) => {
                      maj({ adresse: e.target.value });
                      setVerification(null);
                    }}
                    onBlur={() => void verifier()}
                    error={erreurs.adresse}
                  />
                  <p className={styles.deplacement} role="status">
                    {verificationEnCours ? t.coordonnees.verification : texteDeplacement(verification)}
                  </p>
                </div>
                {/* Champ piège : invisible pour les personnes, rempli par les robots. */}
                <div className={styles.piege} aria-hidden="true">
                  <label htmlFor="devis-site-web">{t.coordonnees.piege}</label>
                  <input
                    id="devis-site-web"
                    name="site_web"
                    tabIndex={-1}
                    autoComplete="off"
                    value={piege}
                    onChange={(e) => setPiege(e.target.value)}
                  />
                </div>
                <div className={styles.recap}>
                  <h3 className={styles.recapTitre}>{t.coordonnees.recapitulatif}</h3>
                  <dl className={styles.recapListe}>
                    {lignesRecapitulatif(demande, config, verification)
                      .filter(([cle]) => !['Nom', 'Entreprise', 'E-mail', 'Téléphone'].includes(cle))
                      .map(([cle, valeur]) => (
                        <div key={cle}>
                          <dt>{cle}</dt>
                          <dd>{valeur}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
                <div className={styles.consentement}>
                  <input
                    id="devis-consentement"
                    type="checkbox"
                    checked={demande.consentement}
                    onChange={(e) => maj({ consentement: e.target.checked })}
                    aria-invalid={erreurs.consentement ? true : undefined}
                    aria-describedby={erreurs.consentement ? 'erreur-consentement' : undefined}
                  />
                  <label htmlFor="devis-consentement">
                    {t.coordonnees.consentement}{' '}
                    <Link to={t.coordonnees.confidentialite.to}>{t.coordonnees.confidentialite.label}</Link>
                  </label>
                </div>
                {erreurs.consentement && (
                  <p id="erreur-consentement" className={styles.erreur}>
                    {erreurs.consentement}
                  </p>
                )}
              </div>
            )}

            {(statut === 'echec' || statut === 'tropRapide') && (
              <div className={styles.echec} role="alert">
                <p className={styles.echecTitre}>{t.echec.titre}</p>
                <p>{statut === 'tropRapide' ? t.echec.tropRapide : t.echec.texte}</p>
              </div>
            )}

            <div className={styles.navigation}>
              {position > 0 && (
                <Button variant="ghost" onClick={() => setEtape(actives[position - 1])}>
                  {t.retour}
                </Button>
              )}
              <Button type="submit" size="lg" disabled={statut === 'envoi'} className={styles.continuer}>
                {derniere ? (statut === 'envoi' ? t.envoi : t.envoyer) : t.continuer}
              </Button>
            </div>
          </form>

          <aside className={styles.projet} aria-label={t.apercu.titre}>
            <div className={styles.projetCarte}>
              <p className={styles.projetTitre}>{t.apercu.titre}</p>
              {metierNom || demande.besoins.length > 0 ? (
                <>
                  {metierNom && <p className={styles.projetMetier}>{metierNom}</p>}
                  {demande.besoins.length > 0 && (
                    <ul className={styles.projetListe}>
                      {demande.besoins.map((b) => (
                        <li key={b}>{besoins.find((x) => x.id === b)?.nom}</li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p className={styles.projetVide}>{t.apercu.vide}</p>
              )}
              {resume && (
                <div className={styles.projetEstimation}>
                  <p>
                    {t.apercu.configuration} : {resume.formule}
                  </p>
                  <p>
                    {t.apercu.estimation} : <strong>{resume.estimation}</strong>
                  </p>
                </div>
              )}
            </div>
            <p className={styles.conseil}>
              {t.apercu.conseil} <strong>{t.apercu.signature}</strong>
            </p>
          </aside>
        </div>
      </Container>
    </>
  );
}
