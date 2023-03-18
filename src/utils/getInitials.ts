export const getInitials = (name: string) => {
  if (typeof name !== 'string') return;
  const [[first = ''] = '', [second = ''] = ''] = name.replace(/\W/g, ' ').replace(/\s+/g, ' ').split(' ');
  return `${first}${second}`.toUpperCase();
};
