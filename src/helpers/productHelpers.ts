import { GamesGenres, Platforms } from '../types/productTypes';
import { enumToDescriptedArray } from './enumToArray';

export function getGenreNameByValue(genre: string) {
  return enumToDescriptedArray(GamesGenres).filter((v) => v.value.toLowerCase() === genre.toLowerCase())[0];
}

export function getPlatformNameByValue(platform: string) {
  return enumToDescriptedArray(Platforms).filter((v) => v.value.toLowerCase() === platform.toLowerCase())[0];
}
