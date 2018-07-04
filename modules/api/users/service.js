class UsersService {
  constructor(req) {
    this.req = req;
  }

  fetchUsers(q) {
    const { User } = this.req.models;
    let {
      page, pageSize, sorted, filtered
    } = q;
    let query = {};
    let sort = {};
    if (filtered) {
      query = filtered.reduce((obj, item) => {
        obj[item.id] = new RegExp(item.value, 'i');
        return obj;
      }, {});
    }

    if (sorted) {
      sort[sorted[0].id] = sorted[0].desc === 'true' ? -1 : 1;
    }

    const options = {
      page: parseInt(page, 10) + 1,
      limit: parseInt(pageSize, 10),
      sort
    };
    return User.paginate(query, options);
  }

  fetchUserById(id) {
    const { User } = this.req.models;
    return User.findById(id);
  }

  createUser(data) {
    const { User } = this.req.models;
    return User.create(data);
  }

  activateUser(id) {
    const { User } = this.req.models;
    return User.findByIdAndUpdate(id, { status: 'active' }, { new: true });
  }

  async findByIdAndUpdate(id, body) {
    const { User } = this.req.models;
    const {
      fname, lname, locale, phone, password, picture
    } = body;
    let user = await User.findById(id);

    if (fname) {
      user.fname = fname;
    }
    if (lname) {
      user.lname = lname;
    }
    if (picture) {
      user.picture = picture;
    }
    if (password) {
      if (this.validatePassword(password).error) {
        return this.validatePassword(password);
      }
      user.password = password;
    }
    if (phone) {
      user.phone = phone;
    }
    if (locale) {
      user.language = locale;
    }
    return user.save();
  }

  deleteUserById(id) {
    const { User } = this.req.models;
    return User.remove({ _id: id });
  }

  logIn(email, password) {
    const { User } = this.req.models;
    return User.findOne({ email }).then(user => {
      if (!user || !user.validatePassword(password)) {
        return {
          status: 401,
          error: "The email or password doesn't match.",
          code: 'wrongEmailOrPassword'
        };
      }
      if (user.status === 'blocked') {
        return {
          status: 401,
          error: 'The account is blocked by admins.',
          code: 'blocked'
        };
      }
      return user;
    });
  }

  validateUserRegistrationReq(user) {
    if (!user.email) {
      return { status: 400, error: 'You must provide an email.', code: 'missingEmail' };
    }
    if (!user.name) {
      return { status: 400, error: 'You must provide your full name.', code: 'missingFullName' };
    }

    const validatePassword = this.validatePassword(user.password);

    if (validatePassword.error) {
      return validatePassword;
    }

    return true;
  }

  validatePassword(password) {
    if (!password) {
      return { status: 400, error: 'You must provide a password.', code: 'missingPassword' };
    }
    if (password.length < 8) {
      return {
        status: 400,
        error: 'Password must be 8 characters or longer.',
        code: 'shortPassword'
      };
    }
    if (password.length > 128) {
      return {
        status: 400,
        error: 'Password must be 128 characters or less.',
        code: 'longPassword'
      };
    }
    return true;
  }
}

module.exports = UsersService;
