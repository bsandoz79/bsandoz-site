# Champ de saisie (`TextField`)

Champ texte ou zone de texte avec libellé, aide et message d'erreur.

## Utilisation
```tsx
import { TextField } from '@bsandoz79/blocs';

<TextField label="E-mail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={erreur} />
<TextField label="Votre projet" multiline rows={6} hint="Avec vos mots." value={texte} onChange={…} />
```

## Propriétés
| Prop | Type | Rôle |
| --- | --- | --- |
| `label` | `string` | libellé (vrai `<label>`) |
| `hint` | `string` | aide sous le libellé |
| `error` | `string` | message d'erreur ; le champ passe en `aria-invalid` |
| `multiline` | `boolean` | zone de texte (`<textarea>`) |

Toutes les autres propriétés natives (`type`, `value`, `onChange`, `required`, `autoComplete`…) sont transmises. Un astérisque visuel signale un champ `required`.

## Accessibilité
- Libellé relié au champ ; aide et erreur reliées par `aria-describedby`, donc lues avec le champ.
- Erreur signalée par la couleur, une icône et le texte (pas par la couleur seule).
