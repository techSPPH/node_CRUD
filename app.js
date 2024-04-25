const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 8000;

//db connection
const sequelize = new Sequelize('nodedb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

//userinfo model
const UserInfo = sequelize.define('userinfo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Fname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Lname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});


(async () => {
  await sequelize.sync({ force: true });
  console.log('All models were synchronized successfully.');
})();


app.use(bodyParser.json());

// CRUD operations

// Create
app.post('/userinfo', async (req, res) => {
  try {
    const { Fname, Lname, age } = req.body;
    const userInfo = await UserInfo.create({ Fname, Lname, age });
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read all
app.get('/userinfo', async (req, res) => {
  try {
    const userInfos = await UserInfo.findAll();
    res.json(userInfos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read one
app.get('/userinfo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userInfo = await UserInfo.findByPk(id);
    if (!userInfo) {
      res.status(404).json({ error: 'User info not found' });
    } else {
      res.json(userInfo);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
app.put('/userinfo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Fname, Lname, age } = req.body;
    const [updated] = await UserInfo.update({ Fname, Lname, age }, { where: { id } });
    if (updated) {
      const updatedUserInfo = await UserInfo.findByPk(id);
      res.json({ message: 'User info updated successfully', userInfo: updatedUserInfo });
    } else {
      res.status(404).json({ error: 'User info not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
app.delete('/userinfo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserInfo.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'User info deleted successfully' });
    } else {
      res.status(404).json({ error: 'User info not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
