const { getEndpointsConfig } = require('~/server/services/Config');
async function endpointController(req, res) {
  const endpointsConfig = await getEndpointsConfig(req);
  const userRole = req.user?.role || '';
  const isAdmin = userRole === 'ADMIN';
  
  if (endpointsConfig) {
    if (isAdmin) {
      // Админы видят все модели - включаем fetch
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
      // Обычные пользователи видят только три агента
      delete endpointsConfig['Claude'];
      delete endpointsConfig['GPT'];
    }
  }
  res.send(JSON.stringify(endpointsConfig));
}
module.exports = endpointController;
