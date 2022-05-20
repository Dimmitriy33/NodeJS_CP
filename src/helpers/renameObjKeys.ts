/* eslint-disable @typescript-eslint/ban-ts-comment */
export default function renameKeys(obj: object, newKeys: { [key: string]: string }) {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    //@ts-ignore
    return { [newKey]: obj[key] };
  });

  return Object.assign({}, ...keyValues);
}
