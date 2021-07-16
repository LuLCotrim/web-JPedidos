import * as Yup from 'yup';

import Client from '../models/Client';
import User from '../models/User';

class ClientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      phone: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      address: Yup.string().required(),
    });
    const userType = await User.findByPk(req.userId);

    if (userType.type !== 'funcionario') {
      return res.status(401).json({
        error: 'Unauthorized, only employees can complete this action!',
      });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const clientExists = await Client.findOne({
      where: { email: req.body.email },
    });

    if (clientExists) {
      return res.status(400).json({ error: 'Client already exists' });
    }

    const { id, name, phone, email, address } = await Client.create(req.body);

    return res.json({ id, name, phone, email, address });
  }

  async index(req, res) {
    const userType = await User.findByPk(req.userId);

    if (userType.type !== 'funcionario') {
      return res.status(401).json({
        error: 'Unauthorized, only employees can complete this action!',
      });
    }

    const clients = await Client.findAll({
      attributes: ['id', 'name', 'phone', 'email', 'address'],
    });

    return res.json(clients);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      phone: Yup.string(),
      email: Yup.string().email(),
      address: Yup.string(),
    });

    const userType = await User.findByPk(req.userId);

    if (userType.type !== 'funcionario') {
      return res.status(401).json({
        error: 'Unauthorized, only employees can complete this action!',
      });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const client = await Client.findByPk(req.params.id);

    if (email && email !== client.email) {
      const clientExists = await Client.findOne({ where: { email } });

      if (clientExists) {
        return res.status(400).json({ error: 'Client already exists' });
      }
    }

    await client.update(req.body);

    const { id, name, phone, address } = await Client.findByPk(req.params.id);

    return res.json({
      id,
      name,
      email,
      phone,
      address,
    });
  }

  async delete(req, res) {
    const userType = await User.findByPk(req.userId);

    if (userType.type !== 'funcionario') {
      return res.status(401).json({
        error: 'Unauthorized, only employees can complete this action!',
      });
    }

    const client = await Client.findByPk(req.params.id);

    const { id, name } = await client.destroy();

    return res.json({
      id,
      name,
    });
  }
}

export default new ClientController();
