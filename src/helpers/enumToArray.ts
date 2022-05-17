type Descripted<T> = {
  [K in keyof T]: {
    readonly key: T[K];
    readonly value: string;
  };
}[keyof T];

/**
 * Helper to produce an array of enum descriptors.
 * @param enumeration Enumeration object.
 * @param separatorRegex Regex that would catch the separator in your enum key.
 */
export function enumToDescriptedArray<T>(enumeration: T, separatorRegex = /_/g): Descripted<T>[] {
  return (Object.keys(enumeration) as Array<keyof T>)
    .filter((key) => Number.isNaN(Number(key)))
    .filter((key) => typeof enumeration[key] === 'number' || typeof enumeration[key] === 'string')
    .map((key) => ({
      key: enumeration[key],
      value: String(key).replace(separatorRegex, ' ')
    }));
}
/**
 * Helper to get an array of enum values.
 * @param enumeration Enumeration object.
 */
export function enumToValuesArray<T>(enumeration: T): T[keyof T][] {
  return (Object.keys(enumeration) as Array<keyof T>)
    .filter((key) => Number.isNaN(Number(key)))
    .filter((key) => typeof enumeration[key] === 'number' || typeof enumeration[key] === 'string')
    .map((key) => enumeration[key]);
}

export function enumToKeysArray<T>(enumeration: T): (keyof T)[] {
  return (Object.keys(enumeration) as Array<keyof T>)
    .filter((key) => Number.isNaN(Number(key)))
    .filter((key) => typeof enumeration[key] === 'number' || typeof enumeration[key] === 'string');
}
