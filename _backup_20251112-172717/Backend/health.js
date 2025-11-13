// Health Check Endpoint for Render.com
// This simple endpoint allows Render to verify that the server is running

module.exports = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'TheBenjiBag Backend'
  });
};
