const { getEndpointsConfig } = require('~/server/services/Config');

async function endpointController(req, res) {
  const endpointsConfig = await getEndpointsConfig(req);

  const userRole = req.user?.role || '';
  const isAdmin = userRole === 'ADMIN';

  if (!isAdmin && endpointsConfig) {
    delete endpointsConfig['Claude'];
    delete endpointsConfig['GPT'];
  }

  res.send(JSON.stringify(endpointsConfig));
}

module.exports = endpointController;
