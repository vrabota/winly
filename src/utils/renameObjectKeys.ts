import camelCase from 'lodash/camelCase';
import trim from 'lodash/trim';

export const renameObjectKeys = (keysMap: any, obj: any, filterValue: string) =>
  Object.keys(obj).reduce(
    (acc: any, key) => {
      if (keysMap[key] === filterValue) {
        return { ...acc, ...{} };
      }
      if (keysMap[key] === 'customVariable') {
        return { ...acc, ...{ customVariables: [...acc.customVariables, { [camelCase(trim(key))]: obj[key] }] } };
      }
      return {
        ...acc,
        ...{ [keysMap[key] || key]: obj[key] },
      };
    },
    { customVariables: [] },
  );
