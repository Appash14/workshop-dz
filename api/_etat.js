/* L'état partagé des neuf étapes.

   Vercel Blob est un stockage d'objets, pas une base: ses suppressions et ses
   listages arrivent en différé. Deux conséquences, et deux parades.

   1. On n'écrase rien et on ne supprime rien. Chaque appui ajoute un objet dont
      le nom porte toute l'information. Aucune écriture n'en écrase une autre,
      donc deux boutons pressés coup sur coup ne peuvent pas se perdre.

   2. Le journal est cloisonné par jour. Sans ça, un listage en retard peut
      rendre une remise à zéro invisible et ressusciter les étapes ouvertes la
      veille. Chaque journée d'atelier repart donc forcément de zéro.

       evt-<AAAAMMJJ>-<horodatage 13 chiffres>-<code|TOUT>-<o|f>-<aléa>
*/
import { list, put } from '@vercel/blob';

export const CODES = ['100', '101', '202', '303', '404', '405', '505', '606', '707'];

/* La journée telle qu'elle est vécue dans la salle, pas là où tourne la
   fonction: sinon l'atelier changerait de jour en plein après-midi. */
export function jour() {
  const p = new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'Europe/Zurich',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return p.replace(/-/g, '');
}

export async function lireEtat() {
  const prefixe = 'evt-' + jour() + '-';
  const { blobs } = await list({ prefix: prefixe, limit: 1000 });
  const noms = blobs.map((b) => b.pathname).sort();
  const ouvertes = new Set();

  for (const nom of noms) {
    const m = /^evt-\d{8}-(\d{13})-([0-9]{3}|TOUT)-([of])-/.exec(nom);
    if (!m) continue;
    const cible = m[2];
    const act = m[3];
    if (cible === 'TOUT') {
      if (act === 'f') ouvertes.clear();
      else CODES.forEach((c) => ouvertes.add(c));
    } else if (act === 'o') {
      ouvertes.add(cible);
    } else {
      ouvertes.delete(cible);
    }
  }

  return CODES.filter((c) => ouvertes.has(c));
}

export async function noter(cible, act) {
  const ts = String(Date.now()).padStart(13, '0');
  const alea = Math.random().toString(36).slice(2, 8);
  await put(`evt-${jour()}-${ts}-${cible}-${act}-${alea}`, '1', {
    access: 'public',
    contentType: 'text/plain',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}
