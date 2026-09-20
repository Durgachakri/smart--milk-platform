const constants = require('../config/constants');

const dateHelpers = {
  isBeforeCutoff: () => {
    const now = new Date();
    return now.getHours() < constants.CUTOFF_HOUR;
  }
};

module.exports = dateHelpers;