import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string().required(),
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });
    const userType = await User.findByPk(req.userId);

    if (userType.type !== 'administrador') {
      return res.status(401).json({
        error: 'Unauthorized, only administrators can complete this action!',
      });
    }
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const userExists = await User.findOne({ where: { login: req.body.login } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, login, name, email, type } = await User.create(req.body);

    return res.json({ id, name, email, type, login });
  }

  async index(req, res) {
    const users = await User.findAll({
      attributes: ['id', 'login', 'name', 'email', 'type'],
    });

    return res.json(users);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      login: Yup.string(),
      email: Yup.string().email(),
      type: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { login } = req.body;

    const user = await User.findByPk(req.body.id);

    if (login && login !== user.login) {
      const userExists = await User.findOne({ where: { login } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    await user.update(req.body);

    const { id, name, email, type } = await User.findByPk(req.params.id);

    return res.json({
      id,
      name,
      login,
      email,
      type,
    });
  }

  async delete(req, res) {
    const user = await User.findByPk(req.params.id);

    const { id, name } = await user.destroy();

    return res.json({
      id,
      name,
    });
  }
}

export default new UserController();
