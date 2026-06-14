export const RACES = {
  'sant-joan': {
    name: "Pujada a l'Ermita de Sant Joan",
    shortName: 'Sant Joan',
    description:
      "La cursa de muntanya més emblemàtica del club. Pujada des de Montblanc fins a l'Ermita de Sant Joan, amb 7,2 km i 542 m de desnivell positiu per camins de muntanya amb vistes espectaculars a la Conca de Barberà. Amb modalitat de caminada per a qui prefereixi gaudir del paisatge sense competir.",
    month: 'Juny',
    distance: 7.2,
    elevation: 542,
    image: '/images/sant-joan.jpg',
    routeUrl: 'https://ca.wikiloc.com/rutes-correr/pujada-a-lermita-de-sant-joan-des-de-montblanc-6729388',
    gpxFile: '/gpx/sant-joan.gpx',
    shirtImage: '/images/sant-joan-samarreta.jpg',
  },
  'sant-silvestre': {
    name: 'Sant Silvestre Montblanquina',
    shortName: 'Sant Silvestre',
    description:
      "La cursa de final d'any per excel·lència. 3,4 km (2 voltes al circuit de 1,7 km) per l'entorn de la Plaça de Sant Francesc i el centre medieval de Montblanc. Amb cursa infantil de 500 m i premi al disfràs més original.",
    month: 'Desembre',
    distance: 3.4,
    elevation: 30,
    image: '/images/sant-silvestre.jpg',
    routeUrl: null,
    gpxFile: null,
  },
  'cursa-dona': {
    name: 'Cursa Solidària de la Dona de Montblanc',
    shortName: 'Cursa de la Dona',
    description:
      "5 km solidaris per carrers i camins de Montblanc, en modalitat corrent o caminant. Cada any dedicada a una causa diferent. Organitzada pel Club Atlètic Montblanc amb la col·laboració d'Adomont.",
    month: 'Novembre',
    distance: 5,
    elevation: 30,
    image: '/images/cursa-dona.jpg',
    routeUrl: 'https://ca.wikiloc.com/rutes-senderisme/montblanc-118283952',
    gpxFile: null,
  },
  'sant-josep': {
    name: "Cursa de l'Ermita de Sant Josep",
    shortName: 'Sant Josep',
    description:
      "Cursa de fons (10 km cronometrada amb xip) i cursa popular (3 km no competitiva) des de l'Ermita de Sant Josep. Amb avituallament al km 5, bossa del corredor, esmorzar per a tots i sorteig de regals.",
    month: 'Maig',
    distance: 10,
    elevation: 200,
    image: '/images/sant-josep.jpg',
    routeUrl: 'https://ca.wikiloc.com/rutes-correr/cursa-ermita-sant-josep-100695922',
    gpxFile: null,
  },
} as const;

export type RaceKey = keyof typeof RACES;
export const RACE_KEYS = Object.keys(RACES) as RaceKey[];

/** Extracts the Wikiloc track ID from a Wikiloc URL, or returns null. */
export function getWikiloc(url: string): string | null {
  if (!url.includes('wikiloc.com')) return null;
  return url.match(/(\d+)(?:[/?#]|$)/)?.[1] ?? null;
}

/** Returns the iframe src for a Wikiloc embed, or null if not a Wikiloc URL. */
export function wikiloc(url: string): string | null {
  const id = getWikiloc(url);
  if (!id) return null;
  return `https://www.wikiloc.com/wikiloc/spatialArtifacts.do?event=setTrack&id=${id}&measures=on&title=on&near=on&position=on&elevation=on`;
}
