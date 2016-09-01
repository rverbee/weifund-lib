// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('./contracts');
const campaignRegistry = contracts.campaignRegistryContract;

// require load campaign
const getCampaign = require('./getCampaign');

// load campaigns
// returns object with campaign data by ID
const getCampaigns = function (options, callback) {
  // loaded campaigns
  var loadedCampaigns = {};
  var expectedNumberToLoad = 0;
  var actualNumberLoaded = 0;

  // get total number of campaigns
  campaignRegistry.numCampaigns(function (totalError, numCampaigns) {
    var campaignID;

    // handle total error
    if (totalError) {
      return callback(`Error while getting total number of campaigns: ${totalError}`, null);
    }

    // total campaigns in contract
    const totalCampaigns = numCampaigns.toNumber(10);

    // change expected number of campaigns to load to total
    expectedNumberToLoad = totalCampaigns;

    // load campaign and assign
    // function context switch
    const getCampaignAndAssign = function (campaignIDAssign) {
      getCampaign(campaignIDAssign, function (campaignLoadError, campaignLoadResult) {
        actualNumberLoaded += 1;

        // if no load error
        if (!campaignLoadError) {
          loadedCampaigns[campaignIDAssign] = campaignLoadResult;
        }

        // fire end callback
        if (expectedNumberToLoad === actualNumberLoaded) {
          callback(null, loadedCampaigns);
        }
      });
    };

    // loop through campaigns and load from registry
    for (campaignID = totalCampaigns - 1; campaignID >= 0; campaignID--) {
      getCampaignAndAssign(campaignID);
    }
  });
};

// export get campaigns method
module.exports = getCampaigns;
