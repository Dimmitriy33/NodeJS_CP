/* eslint-disable @typescript-eslint/no-explicit-any */
export const simpleMapPatch = (patch: Array<any>) => {
  const result: any = {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  patch.forEach(({ op, path, value }) => {
    const pathArr = path.split('/');
    const key = pathArr.pop();

    result[key.charAt(0).toLowerCase() + key.slice(1)] = value;
  });

  return result;
};
