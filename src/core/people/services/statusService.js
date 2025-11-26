const { getStatusInfoArabic, getStatusRewardsArabic } = require('../status');

function getOverview() {
  return getStatusInfoArabic();
}

function getRewards() {
  return getStatusRewardsArabic();
}

module.exports = {
  getOverview,
  getRewards
};
