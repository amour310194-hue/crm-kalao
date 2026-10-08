# Thème Kalao

La direction retenue pour les jetons est **Signal** : fond gris froid, barre bleu nuit, rayons de 4 px et 8 px. Atelier reste visible sur `/styleguide` pour comparaison. Le bleu `#0071BC` et l’orange `#FBB03B` viennent du fichier `public/assets/img/kalao-logo.png`.

## Activer le thème

Le rendu du modèle reste celui par défaut. Le thème s’allume avec l’attribut `data-theme-kalao` sur `<html>`, posé quand `NEXT_PUBLIC_THEME_KALAO=1`.

Sans cet attribut, `src/style/kalao-theme.css` ne change aucun écran.

## Couleurs

- Marque `#0071BC`, survol `#005A96`. Le bouton principal prend cette couleur. Le rouge `#9F1239` est réservé au danger.
- Accent `#FBB03B`, seulement en repère (classe `kalao-accent`), pas comme bouton.
- Texte `#102033` sur fond `#F3F6F8` et surface `#FFFFFF`. Texte atténué `#3D5166`.
- Succès, avertissement, danger et information ont un fond clair et un texte foncé. En mode sombre, le texte de ces pastilles s’éclaircit.
- Le menu est `#0B3A5B` avec le texte `#E8F1F8`. L’élément actif est `#0071BC` avec un texte blanc.

Le script de contraste est `src/lib/kalao-tokens.ts`. Chaque paire doit atteindre 4,5:1. `src/lib/kalao-tokens.test.ts` échoue si une paire baisse ou si la feuille CSS n’utilise plus la même valeur.

## Typographie

Golos Text. Six tailles : 12, 13, 14, 16, 20 et 28 px. Graisses 400, 500 et 600. Les tableaux, cartes et pastilles utilisent des chiffres tabulaires.

## Espacement, rayons, ombres

Espacement sur une base de 4 px : 4, 8, 12, 16, 24, 32, 48. Deux rayons : 4 px (champs et boutons) et 8 px (cartes, fenêtres). Trois ombres : `--kalao-shadow-1`, `--kalao-shadow-2`, `--kalao-shadow-3`.

## Mode sombre et densité

Le bouton soleil / lune de l’en-tête écrit le choix dans le cookie du thème. Sans choix enregistré, et seulement si le thème Kalao est allumé, l’écran suit le réglage du système.

Le bouton Compact / Confort n’apparaît que lorsque le thème est allumé. Il pose `data-density` et change uniquement le padding des tableaux.
