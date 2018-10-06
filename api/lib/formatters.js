

module.exports.money = (val) => {
  if (val === null || val === undefined) return 0;
  return val.toFixed(2);
};

module.exports.percent = (val) => (val * 100).toFixed(2).replace('.00', '');
