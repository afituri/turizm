const ApiRouter = require('./router-api-v1');
const { reqLocals } = require('../middleware');
const VerificationRoutes = require('./verification-router')();
const recaptcha = require('./recaptcha')();


module.exports = app => {
  app.use('/api/v1', reqLocals(app), ApiRouter());
  app.use('/verifications', reqLocals(app), VerificationRoutes);
  app.use('/recaptcha', reqLocals(app), recaptcha);
};
