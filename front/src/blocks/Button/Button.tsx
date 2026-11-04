import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

type CommonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Prend toute la largeur disponible. */
  block?: boolean;
  className?: string;
};

type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };

type AsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };

export type ButtonProps = AsButton | AsLink;

export type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
};

/**
 * Classes CSS du bouton. Permet d'habiller un autre élément (ex. un lien de routeur) comme un bouton.
 */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  block = false,
  className,
}: ButtonStyleOptions = {}) {
  return [styles.button, styles[variant], styles[size], block ? styles.block : '', className ?? '']
    .filter(Boolean)
    .join(' ');
}

/**
 * Bouton réutilisable. Rend un vrai `<button>`, ou un lien `<a>` si `href` est fourni.
 */
export function Button(props: ButtonProps) {
  const { children, variant, size, block, className, ...rest } = props;
  const classes = buttonClassName({ variant, size, block, className });

  if (rest.href !== undefined) {
    const linkProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={classes} {...linkProps}>
        {children}
      </a>
    );
  }

  const { type = 'button', ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} type={type} {...buttonProps}>
      {children}
    </button>
  );
}
