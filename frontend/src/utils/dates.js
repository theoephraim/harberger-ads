import { default as format } from 'date-fns/format';

export const formatDatetime = (val) => {
  if (!val) return '----';
  return format(val, 'YYYY-MM-DD @ h:mma');
};

export const formatDate = (val) => {
  if (!val) return '----';
  return format(val, 'YYYY-MM-DD');
};
