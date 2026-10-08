/* Quelles étapes Tom a ouvertes. Lue par les pages de la salle toutes les cinq
   secondes, seulement quand leur onglet est visible. Le cache du CDN tient deux
   secondes: quel que soit le nombre de pages ouvertes, le stockage n'est
   sollicité qu'une trentaine de fois par minute. */
import { lireEtat } from './_etat.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=2');

  try {
    return res.status(200).json({ ouvertes: await lireEtat() });
  } catch (e) {
    /* Jamais d'erreur vers la salle: une panne de stockage ne casse pas leur
       page, elle les fait basculer en mode hors ligne. */
    return res.status(200).json({ ouvertes: [], panne: true });
  }
}
