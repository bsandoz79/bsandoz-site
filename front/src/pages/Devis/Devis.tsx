import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, buttonClassName } from '../../blocks/Button';
import { Container } from '../../blocks/Container';
import { Stepper } from '../../blocks/Stepper';
import { TextField } from '../../blocks/TextField';
import { PageMeta } from '../../components/PageMeta';
import { besoins, devisTextes, etapesDevis, urlEnvoiDevis } from '../../data/devis';
import { metiers } from '../../data/offres';
import { pages } from '../../data/pages';
import { chargerEtat } from '../Composer/stockage';
import {
  DELAI_ENVOI_MS,
  chargerBrouillon,
  construireEnvoi,
  effacerBrouillon,
  enregistrerBrouillon,
  lignesRecapitulatif,
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
  // La configuration faite dans « Composer mon site » est reprise si elle existe.
  const config = useMemo(() => chargerEtat().config, []);
  const [{ demande: depart, etape: etapeDepart }] = useState(() => {
    const brouillon = chargerBrouillon();
    if (!brouillon.demande.metier && config.metier) brouillon.demande = { ...brouillon.demande, metier: config.metier };
    return brouillon;
  });
  const [demande, setDemande] = useState<Demande>(depart);
  const [etape, setEtape] = useState(etapeDepart);
  const [photos, setPhotos] = useState<File[]>([]);
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [statut, setStatut] = useState<Statut>('saisie');
  const [piege, setPiege] = useState('');
  const titreRef = useRef<HTMLHeadingElement>(null);
  const premierRendu = useRef(true);

  useEffect(() => {
    if (statut !== 'envoye') enregistrerBrouillon(demande, etape);
  }, [demande, etape, statut]);

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
  const derniere = etape === etapesDevis.length - 1;

  async function envoyer() {
    if (Date.now() - dernierEnvoi() < DELAI_ENVOI_MS) {
      setStatut('tropRapide');
      return;
    }
    setStatut('envoi');
    try {
      const reponse = await fetch(urlEnvoiDevis, { method: 'POST', body: construireEnvoi(demande, config, photos, piege) });
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
    else setEtape(etape + 1);
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
  const metierNom = metiers.find((m) => m.id === demande.metier)?.nom;

  return (
    <>
      <PageMeta title={pages.devis.title} description={pages.devis.description} />
      <Container className={styles.page}>
        <h1 className="sr-only">{pages.devis.heading}</h1>
        <Stepper label={t.progression} steps={etapesDevis} current={etape} />

        <div className={styles.colonnes}>
          <form className={styles.formulaire} onSubmit={suivant} noValidate aria-labelledby="devis-etape-titre">
            <div className={styles.entete}>
              <p className={styles.compteur}>{t.etape(etape + 1, etapesDevis.length)}</p>
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
                    {lignesRecapitulatif(demande, config)
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
              {etape > 0 && (
                <Button variant="ghost" onClick={() => setEtape(etape - 1)}>
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
