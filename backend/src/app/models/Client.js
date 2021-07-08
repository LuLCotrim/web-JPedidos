import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        phone: Sequelize.STRING,
        email: Sequelize.STRING,
        address: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Product;
