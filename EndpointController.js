const { getEndpointsConfig } = require('~/server/services/Config');
async function endpointController(req, res) {
  const endpointsConfig = await getEndpointsConfig(req);
  const userRole = req.user?.role || '';
  const isAdmin = userRole === 'ADMIN';

  if (endpointsConfig) {
    if (isAdmin) {
      if (endpointsConfig['Claude']) {
        endpointsConfig['Claude'].models = {
          default: ["claude-sonnet-4-6"],
          fetch: true
        };
      }
      if (endpointsConfig['GPT']) {
        endpointsConfig['GPT'].models = {
          default: ["gpt-5.4"],
          fetch: true
        };
      }
    } else {
      delete endpointsConfig['Claude'];
      delete endpointsConfig['GPT'];
    }
  }

  console.log('[EndpointController] role:', userRole, 'keys:', Object.keys(endpointsConfig || {}));
  res.send(JSON.stringify(endpointsConfig));
}
module.exports = endpointController;
