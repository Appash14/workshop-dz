/* Le bouton du conducteur tape ici. En GET volontairement, pour que l'appel
   reste une requête simple: pas de pré-vol CORS, donc ça marche depuis la page
   déployée comme depuis un fichier ouvert au double-clic. */
import { lireEtat, noter, CODES } from './_etat.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const { cle, code, action } = req.query || {};

  if (!process.env.CLE_REGIE || cle !== process.env.CLE_REGIE) {
    return res.status(403).json({ erreur: 'cle' });
  }

  try {
    if (action === 'tout-fermer') {
      await noter('TOUT', 'f');
    } else if (action === 'tout-ouvrir') {
      await noter('TOUT', 'o');
    } else {
      if (!CODES.includes(code)) return res.status(400).json({ erreur: 'code' });
      await noter(code, action === 'fermer' ? 'f' : 'o');
    }

    return res.status(200).json({ ouvertes: await lireEtat() });
  } catch (e) {
    return res.status(500).json({ erreur: 'stockage', detail: String(e && e.message) });
  }
}
