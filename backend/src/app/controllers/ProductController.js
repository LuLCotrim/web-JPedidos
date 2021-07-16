import * as Yup from 'yup';

import Product from '../models/Product';
import User from '../models/User';

class ProductController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      value: Yup.number().required(),
    });
    const userType = await User.findByPk(req.userId);

    if (userType.type !== 'gerente') {
      return res.status(401).json({
        error: 'Unauthorized, only managers can complete this action!',
      });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const productExists = await Product.findOne({
      where: { name: req.body.name },
    });

    if (productExists) {
      return res.status(400).json({ error: 'Product already exists' });
    }

    const { id, name, value } = await Product.create(req.body);

    return res.json({ id, name, value });
  }

  async index(req, res) {
    const userType = await User.findByPk(req.userId);

    if (userType.type !== 'gerente') {
      return res.status(401).json({
        error: 'Unauthorized, only managers can complete this action!',
      });
    }

    const products = await Product.findAll({
      attributes: ['id', 'name', 'value'],
    });

    return res.json(products);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      value: Yup.number(),
    });

    const userType = await User.findByPk(req.userId);

    if (userType.type !== 'gerente') {
      return res.status(401).json({
        error: 'Unauthorized, only managers can complete this action!',
      });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { name } = req.body;

    const product = await Product.findByPk(req.params.id);

    if (name && name !== product.name) {
      const productExists = await Product.findOne({ where: { name } });

      if (productExists) {
        return res.status(400).json({ error: 'Product already exists' });
      }
    }

    await product.update(req.body);

    const { id, value } = await Product.findByPk(req.params.id);

    return res.json({
      id,
      name,
      value,
    });
  }

  async delete(req, res) {
    const userType = await User.findByPk(req.userId);

    if (userType.type !== 'gerente') {
      return res.status(401).json({
        error: 'Unauthorized, only managers can complete this action!',
      });
    }

    const product = await Product.findByPk(req.params.id);

    const { id, name } = await product.destroy();

    return res.json({
      id,
      name,
    });
  }
}

export default new ProductController();
