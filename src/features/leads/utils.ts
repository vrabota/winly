import camelCase from 'lodash/camelCase';
import trim from 'lodash/trim';

import { FIELDS_SELECT_OPTIONS } from './constants';

export const getFieldDefaultValue = (value: string): string => {
  const defaultFieldValue = FIELDS_SELECT_OPTIONS.find(item => item.value.includes(camelCase(trim(value))));
  return defaultFieldValue?.value || 'noImport';
};
