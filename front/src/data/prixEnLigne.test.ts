import { formuleParId, options } from './offres';
import { appliquerPrix, preparerPrix, prixDeBase, reinitialiserPrix } from './prixEnLigne';

const maintenant = 1_800_000_000_000;

function apiRepond(prix: unknown, statut = 200) {
  const appel = vi.fn(async () => new Response(JSON.stringify({ prix }), { status: statut }));
  vi.stubGlobal('fetch', appel);
  return appel;
}

afterEach(() => {
  reinitialiserPrix();
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe('Prix du code', () => {
  it('garde les prix annoncés tant que rien n’est modifié', () => {
    expect(prixDeBase['formule.vitrine']).toBe(99);
    expect(prixDeBase['formule.vitrinePlus']).toBe(389);
    expect(prixDeBase['formule.fonctionnel']).toBe(989);
  });
});

describe('appliquerPrix', () => {
  it('remplace le prix d’une formule et d’une option', () => {
    appliquerPrix({ 'formule.vitrine': 120, 'option.logo': 200 });
    expect(formuleParId('vitrine').prix).toBe(120);
    expect(options.logo.prix).toBe(200);
  });

  it.each([
    ['un texte', { 'formule.vitrine': '120' }],
    ['un négatif', { 'formule.vitrine': -1 }],
    ['un décimal', { 'formule.vitrine': 1.5 }],
    ['une clé inconnue', { 'formule.inconnue': 1 }],
    ['une clé piégée', { 'option.__proto__': 1, 'constructor.prix': 1 }],
    ['autre chose qu’un objet', 'non'],
    ['rien', null],
  ])('ignore %s', (_nom, prix) => {
    appliquerPrix(prix);
    expect(formuleParId('vitrine').prix).toBe(99);
    expect(options.logo.prix).toBe(prixDeBase['option.logo']);
  });
});

describe('preparerPrix', () => {
  it('sans rien de modifié, garde les prix du code', async () => {
    apiRepond({});
    await preparerPrix(maintenant);
    expect(formuleParId('vitrine').prix).toBe(99);
  });

  it('applique les prix de l’API et les garde pour la suite', async () => {
    apiRepond({ 'formule.vitrine': 120 });
    await preparerPrix(maintenant);
    expect(formuleParId('vitrine').prix).toBe(120);

    reinitialiserPrix();
    const appel = apiRepond({ 'formule.vitrine': 999 });
    await preparerPrix(maintenant + 1000);
    expect(formuleParId('vitrine').prix).toBe(120);
    expect(appel).not.toHaveBeenCalled();
  });

  it('redemande une fois le cache périmé, et un prix retiré reprend sa valeur', async () => {
    apiRepond({ 'formule.vitrine': 120 });
    await preparerPrix(maintenant);

    apiRepond({});
    await preparerPrix(maintenant + 6 * 60 * 1000);
    expect(formuleParId('vitrine').prix).toBe(99);
  });

  it('API en panne : le site s’affiche quand même, sans échec et sans réessayer tout de suite', async () => {
    const appel = vi.fn(async () => Promise.reject(new Error('réseau')));
    vi.stubGlobal('fetch', appel);
    await expect(preparerPrix(maintenant)).resolves.toBeUndefined();
    expect(formuleParId('vitrine').prix).toBe(99);

    await preparerPrix(maintenant + 1000);
    expect(appel).toHaveBeenCalledTimes(1);
  });

  it('API en erreur : garde le dernier prix connu', async () => {
    apiRepond({ 'formule.vitrine': 120 });
    await preparerPrix(maintenant);

    apiRepond({}, 500);
    await preparerPrix(maintenant + 6 * 60 * 1000);
    expect(formuleParId('vitrine').prix).toBe(120);
  });

  it('API trop lente : la page n’attend pas, le prix servira à la visite suivante', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        await new Promise((r) => setTimeout(r, 30));
        return new Response(JSON.stringify({ prix: { 'formule.vitrine': 120 } }));
      }),
    );
    await preparerPrix(maintenant, 1);
    expect(formuleParId('vitrine').prix).toBe(99);

    await new Promise((r) => setTimeout(r, 60));
    await preparerPrix(maintenant + 1000);
    expect(formuleParId('vitrine').prix).toBe(120);
  });

  it('un cache illisible ne casse rien', async () => {
    localStorage.setItem('bsandoz.prix', '{pas du json');
    apiRepond({});
    await expect(preparerPrix(maintenant)).resolves.toBeUndefined();
    expect(formuleParId('vitrine').prix).toBe(99);
  });
});
