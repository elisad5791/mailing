require('dotenv').config(); 
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.path === '/login') {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
});

server.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = router.db.get('users').find({ email }).value();

  if (!user || password !== 'admin123') {
    return res.status(401).json({ message: 'Неверный email или пароль' });
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

  const { password: _, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
});
server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server with Auth is running on port ${PORT}`);
});