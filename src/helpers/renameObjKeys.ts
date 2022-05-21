/* eslint-disable @typescript-eslint/ban-ts-comment */
export default function renameKeys(obj: object, newKeys: { [key: string]: string }) {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    //@ts-ignore
    return { [newKey]: obj[key] };
  });

  return Object.assign({}, ...keyValues);
}

export function objKeysToLowerCase(obj: object) {
  const keyValues = Object.keys(obj).map((key) => {
    //@ts-ignore
    return { [key.toLowerCase()]: obj[key] };
  });

  return Object.assign({}, ...keyValues);
}

export function objKeysToFirstLetterLowerCase(obj: object) {
  const keyValues = Object.keys(obj).map((key) => {
    //@ts-ignore
    return { [key.charAt(0).toLowerCase() + key.slice(1)]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}
