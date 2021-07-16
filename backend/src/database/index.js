import Sequelize from 'sequelize';

import User from '../app/models/User';
import Product from '../app/models/Product';
import Client from '../app/models/Client';
import Order from '../app/models/Order';
import OrderProduct from '../app/models/OrderProduct';

import databaseConfig from '../config/database';

const models = [User, Product, Client, Order, OrderProduct];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
