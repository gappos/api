import { DataTypes } from 'sequelize';

import { sequelize as db } from '../../db';

export const Book = db.define('book', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false }
});
