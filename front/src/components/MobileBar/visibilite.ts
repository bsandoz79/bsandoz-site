import { mobileBar } from '../../data/navigation';

/** La barre « Estimer » est-elle affichée sur cette page ? (sur mobile ; le CSS la masque sur ordinateur) */
export function barreMobileVisible(pathname: string) {
  return !mobileBar.hiddenOn.includes(pathname) && !mobileBar.hiddenUnder.some((debut) => pathname.startsWith(debut));
}
