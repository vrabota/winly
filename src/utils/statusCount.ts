export const statusCount = (data: any) => {
  return data?.reduce((acc: any, cur: any) => {
    Object.keys(cur).forEach(key => {
      if (key !== 'date') {
        acc[key] = Number(acc[key] || 0) + Number(cur[key]);
      }
    });
    return acc;
  }, {});
};
