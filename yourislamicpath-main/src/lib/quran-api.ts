export interface SurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface QuranAyah {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  audio?: string;
}

const QURAN_API = "https://api.alquran.cloud/v1";

export async function getSurahs(): Promise<SurahSummary[]> {
  const response = await fetch(`${QURAN_API}/surah`);

  if (!response.ok) {
    throw new Error("Could not load the Quran chapters.");
  }

  const result = await response.json();
  return result.data;
}

export async function getSurah(number: number): Promise<{
  surah: SurahSummary;
  ayahs: QuranAyah[];
}> {
  const response = await fetch(
    `${QURAN_API}/surah/${number}/editions/quran-uthmani,en.sahih,ar.alafasy`,
  );

  if (!response.ok) {
    throw new Error("Could not load this surah.");
  }

  const result = await response.json();

  const arabicEdition = result.data[0];
  const translationEdition = result.data[1];
  const audioEdition = result.data[2];

  return {
    surah: {
      number: arabicEdition.number,
      name: arabicEdition.name,
      englishName: arabicEdition.englishName,
      englishNameTranslation: arabicEdition.englishNameTranslation,
      numberOfAyahs: arabicEdition.numberOfAyahs,
      revelationType: arabicEdition.revelationType,
    },
    ayahs: arabicEdition.ayahs.map(
      (ayah: { number: number; numberInSurah: number; text: string }, index: number) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        translation: translationEdition.ayahs[index]?.text ?? "",
        audio: audioEdition.ayahs[index]?.audio,
      }),
    ),
  };
}
