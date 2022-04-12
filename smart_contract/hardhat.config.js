require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.1',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/B9cwldyhFFnwqM_J7AbgJaDhuIIl9VOh',
      accounts: ['f8490053bccb44d05ca6cc857f717bbb0d0d184dbee23ed60f31276a81035796'],// edit
    },
  },
};