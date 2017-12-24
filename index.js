const jsonServer = require('json-server');
const { body, validationResult } = require('express-validator/check');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

// Add custom routes before JSON Server router
server.post('/checkout', [
  body('email')
    .isEmail()
    .withMessage('must be an email'),

  body('creditCard')
    .matches(/^[0-9]{8}$/)
    .withMessage('must be a credit card number (8 numbers)'),

  body('movie.title')
    .exists()
    .withMessage('is required'),

  body('movie.datetime')
    .isISO8601()
    .withMessage('must be a valid ISO 8601 date')

], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  res.status(201).json('🎫');
});

// Use default router
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
