# Atelier Claude Code et Codex

Le support d'un atelier d'une journée que j'ai donné chez Digitalizers, à Neuchâtel, pour des débutants. À la fin de la journée, chacun repart avec sa page en ligne, faite avec Claude Code et Codex.

## Le principe

- La page des participants montre les gestes de base, puis neuf étapes.
- Chaque étape est verrouillée. Elle s'ouvre pour toute la salle quand je donne son code à voix haute. Personne ne prend deux étapes d'avance : celui qui a fini aide son voisin.
- Si le serveur ne répond pas, les pages passent en mode hors ligne et les codes marchent seuls. L'atelier ne s'arrête jamais.

## Fichiers

| Chemin | Rôle |
|---|---|
| `index.html` | La page des participants |
| `ecran.html` | Le support projeté |
| `api/etat` | Quelles étapes sont ouvertes |
| `api/ouvrir` | Ouvre ou ferme une étape, protégé par la variable `CLE_REGIE` |

## Lancer

Pages statiques et deux fonctions serverless Vercel ; l'état des étapes est gardé dans Vercel Blob.

```sh
npm install
npx vercel dev
```

Définir `CLE_REGIE` et brancher un stockage Vercel Blob au projet.
