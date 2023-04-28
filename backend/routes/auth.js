const Router = require('express').Router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../db');

const router = Router();

const createToken = () => {
  return jwt.sign({}, 'secret', { expiresIn: '1h' });
};

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Check if user login is valid
  // If yes, create token and return it to client
  db.getDb().db().collection('users')
    .findOne({email: email})
    .then(userDoc => {
      return bcrypt.compare(pw, userDoc.password);
    }).then(result => {
      if(!result){
        throw Error();
      }
      const token = createToken();
      res.status(200).json({
        message: 'Authentication succeeded',
        token: token
      })
    })
    .catch(err => {
      res
      .status(401)
      .json({ message: 'Authentication failed, invalid username or password.' });

    })
  });

router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Hash password before storing it in database => Encryption at Rest
  bcrypt
    .hash(pw, 12)
    .then(hashedPW => {
      // Store user and hashedPW in database 
      console.log(hashedPW);
      db.getDb().db().collection('users')
        .insertOne({
          email: email,
          password: hashedPW
        })
        .then(result => {
          console.log(result);
          const token = createToken();
          res.status(201)
            .json({ token: token, user: { email: email } });
        })
        .catch( err => {
          console.log(err);
          res.status(500).json({message: "Error during creation of user"})
        });


      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Creating the user failed.' });
    });
});

module.exports = router;
