const { verifySession } = require('../lib/cms-auth');

module.exports = async (req, res) => {
  res.status(200).json({ loggedIn: verifySession(req) });
};
