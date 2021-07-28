import * as Yup from 'yup';

import Product from '../models/Product';
import User from '../models/User';
import Order from '../models/Order';
import OrderProduct from '../models/OrderProduct';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      status: Yup.string().required(),
      user_id: Yup.number().required(),
      client_id: Yup.number().required(),
      total: Yup.number().required(),
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

    const { id, total } = await Order.create({
      status: req.body.status,
      user_id: req.body.user_id,
      client_id: req.body.cliente_id,
      total: req.body.total,
    });

    req.body.product_id.map(async body_product => {
      await OrderProduct.create({
        quantity: body_product[1],
        order_id: id,
        product_id: body_product[0],
      });
    });

    return res.json({ id, total });
  }

  async index(req, res) {
    const userType = await User.findByPk(req.userId);

    if (userType.type !== 'gerente' && userType.type !== 'funcionario') {
      return res.status(401).json({
        error: 'Unauthorized, you can not complete this action!',
      });
    }

    const products = await OrderProduct.findAll({
      attributes: ['quantity', 'order_id', 'product_id'],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'total', 'status'],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'value'],
        },
      ],
    });

    return res.json(products);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      value: Yup.number(),
    });

    const userType = await User.findByPk(req.userId);

    if (userType.type !== 'gerente' && userType.type !== 'funcionario') {
      return res.status(401).json({
        error: 'Unauthorized, you can not complete this action!',
      });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.findByPk(req.params.id);

    await order.update(req.body);

    const { id, status } = await Order.findByPk(req.params.id);

    return res.json({
      id,
      status,
    });
  }
}

export default new OrderController();
