const Service = require('./service');
// const mongoose = require('mongoose');

const Auth = require('../../../services/auth');

class UsersAPIController {
  me(req, res) {
    let { user } = req;
    user = user.toObject();
    delete user.passwordHash;
    return res.json({ me: user });
  }

  usersIndex(req, res) {
    const service = new Service(req);

    return service
      .fetchUsers(req.query)
      .then(users => {
        return res.json({ users });
      })
      .catch(e => {
        console.log('\nError on at usersIndex - GET /users', e);
        return res.status(400).json({ error: e });
      });
  }

  usersShow(req, res) {
    const service = new Service(req);
    const { id } = req.params;

    service
      .fetchUserById(id)
      .then(user => {
        user = user.toObject();
        delete user.passwordHash;
        return res.json({ user });
      })
      .catch(e => {
        console.log(`\nError at GET /users/${id}`, e);
        return res.status(400).json({ error: e, code: 'unknownError' });
      });
  }

  usersCreate(req, res) {
    const service = new Service(req);
    const {
      name, email, password, locale, admin, phone
    } = req.body;
    const validatedUser = service.validateUserRegistrationReq(req.body);

    if (validatedUser.error) {
      return res
        .status(validatedUser.status)
        .json({ error: validatedUser.error, code: validatedUser.code });
    }

    const create = data => {
      service
        .createUser(data)
        .then(user => {
          return res.status(201).send(Auth.createToken({
            _id: user._id,
            admin: user.admin,
            name: user.name,
            email: user.email,
            phone: user.phone,
            locale: user.locale
          }));
        })
        .catch(e => {
          return res
            .status(401)
            .json({ error: `Error persisting user: ${e}`, code: 'unknownError' });
        });
    };

    return create({
      admin,
      locale,
      email,
      name,
      password,
      phone
    });
  }

  usersUpdate(req, res) {
    const service = new Service(req);
    const { id } = req.params;
    const updateUser = service.findByIdAndUpdate(id, req.body);

    updateUser
      .then(user => {
        user = user.toObject();
        delete user.passwordHash;
        res.status(200).json({ user });
      })
      .catch(e => {
        console.log(`Error at PUT /users/${id}`, e);
        res.status(400).json({ error: e, code: 'unknownError' });
      });
  }

  usersDelete(req, res) {
    const service = new Service(req);
    const { id } = req.params;

    const deleteUser = service.deleteUserById(id);

    deleteUser.then(() => res.status(200).json({ id })).catch(e => {
      console.log(`Error at Delete /users/${id}`, e);
      return res.status(400).json({ error: e, code: 'unknownError' });
    });
  }

  loginUser(req, res) {
    const { email, password } = req.body;
    const service = new Service(req);

    if (!email || !password) {
      return res.status(400).json({
        error: 'You must send the email and the password.',
        code: 'missingEmailOrPassword'
      });
    }
    return service.logIn(email, password).then(user => {
      if (user.error) {
        return res.status(user.status).json({ error: user.error, code: user.code });
      }
      return res.status(200).send(Auth.createToken({
        _id: user._id,
        admin: user.admin,
        name: user.name,
        email: user.email,
        phone: user.phone,
        locale: user.locale
      }));
    });
  }
}

module.exports = new UsersAPIController();
