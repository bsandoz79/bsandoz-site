<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Pdf;

use App\Prospect\Domain\Demande;
use App\Prospect\Domain\Devis;
use App\Prospect\Infrastructure\Mail\NotificationsProspectParMail;
use Dompdf\Dompdf;
use Dompdf\Options;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Devis au format PDF (dompdf, PHP pur). Tout le texte est échappé ; aucune ressource extérieure n'est chargée.
 * Les mentions légales encore inconnues (SIRET) restent visibles « [à compléter] » : rien n'est inventé.
 */
final class DevisPdf
{
    public function __construct(
        #[Autowire('%prospect.professionnel_nom%')]
        private readonly string $professionnelNom,
        #[Autowire('%prospect.professionnel_email%')]
        private readonly string $professionnelEmail,
        #[Autowire('%prospect.siret%')]
        private readonly string $siret,
    ) {
    }

    public function generer(Demande $demande, Devis $devis): string
    {
        $options = new Options();
        $options->setIsRemoteEnabled(false);
        $options->setDefaultFont('DejaVu Sans'); // gère les accents et l'espace insécable
        $pdf = new Dompdf($options);
        $pdf->loadHtml($this->html($demande, $devis), 'UTF-8');
        $pdf->setPaper('A4');
        $pdf->render();

        return (string) $pdf->output();
    }

    public function html(Demande $demande, Devis $devis): string
    {
        $e = static fn (string $t): string => htmlspecialchars($t, \ENT_QUOTES | \ENT_HTML5, 'UTF-8');
        $euros = static fn (int $m): string => $e(NotificationsProspectParMail::euros($m));
        $d = $demande->demandeur;
        $lignes = '';
        foreach ($devis->lignes() as $ligne) {
            $lignes .= "<tr><td>{$e($ligne->libelle)}</td><td class=\"prix\">{$euros($ligne->prix)}</td></tr>";
        }
        $client = $e($d->nom) . ($d->entreprise !== '' ? '<br>' . $e($d->entreprise) : '') . '<br>' . $e($d->email) . ($d->telephone !== '' ? '<br>' . $e($d->telephone) : '');
        $siret = $this->siret !== '' ? $e($this->siret) : '[à compléter]';
        $accepte = $devis->accepteLe() !== null ? '<p class="accepte">Devis accepté le ' . $devis->accepteLe()->format('d/m/Y') . '.</p>' : '';

        return <<<HTML
            <!doctype html>
            <html lang="fr"><head><meta charset="utf-8"><title>Devis n° {$e($devis->numero)}</title>
            <style>
              body { font-family: 'DejaVu Sans', sans-serif; font-size: 11pt; color: #16213e; }
              h1 { font-size: 20pt; margin: 0 0 4mm; }
              .entete { width: 100%; margin-bottom: 10mm; }
              .entete td { vertical-align: top; width: 50%; }
              table.lignes { width: 100%; border-collapse: collapse; margin-top: 6mm; }
              table.lignes th, table.lignes td { border-bottom: 1px solid #e4e2ec; padding: 2.5mm 2mm; text-align: left; }
              .prix { text-align: right; white-space: nowrap; }
              .total td { font-weight: bold; border-top: 2px solid #16213e; border-bottom: none; }
              .mentions { margin-top: 10mm; font-size: 9pt; color: #4a5068; }
              .accepte { margin-top: 6mm; font-weight: bold; color: #13794a; }
            </style></head>
            <body>
              <table class="entete"><tr>
                <td><strong>{$e($this->professionnelNom)}</strong><br>Création de sites web &amp; développement<br>{$e($this->professionnelEmail)}<br>SIRET : {$siret}</td>
                <td><strong>Client</strong><br>{$client}</td>
              </tr></table>
              <h1>Devis n° {$e($devis->numero)}</h1>
              <p>Établi le {$devis->envoyeLe->format('d/m/Y')} · {$e($demande->titre)}</p>
              <table class="lignes">
                <thead><tr><th>Désignation</th><th class="prix">Prix</th></tr></thead>
                <tbody>{$lignes}<tr class="total"><td>Total</td><td class="prix">{$euros($devis->total)}</td></tr></tbody>
              </table>
              {$accepte}
              <p class="mentions">Prix nets. TVA non applicable, art. 293 B du CGI.</p>
            </body></html>
            HTML;
    }
}
