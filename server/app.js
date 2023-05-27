const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const port = 5000;
const connection = require('./connection');
const router = express.Router();

app.use(cors());
app.use(express.json()); // Add this line to parse request body as JSON

router.get('/getTotalRevenue', (req, res) => {
  connection.query(
    'SELECT COUNT(totalPrice) FROM `listOrder`',
    function(err, results) {
      res.send(results);
    }
  )
});

router.get('/getAllOrders', (req, res) => {
  connection.query(
    'SELECT * FROM `listOrder`',
    function(err, results) {
      res.send(results);
    }
  )
});


router.post('/createOrder', (req, res) => {
  const { totalPrice, createdAt, discount, createdTime, orderLines } = req.body;
  const orderID = uuidv4();
  connection.query(
    'INSERT INTO `listOrder` (`orderId`, `totalPrice`, `createdAt`, `discount`, `createdTime`) VALUES (?, ?, ?, ?, ?)',
    [orderID, totalPrice, createdAt, discount, createdTime],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (results.affectedRows === 1) {
          orderLines.forEach(item => {
            connection.query(
              'INSERT INTO `orderLine` (`productId`, `orderId`, `quantity`, `salePrice`) VALUES (?, ?, ?, ?)',
              [item.productId, orderID, item.quantity, item.price]
            );
          });
          res.status(200).send({ message: 'Successfully to create new order' });
        } else {
          res.status(401).send({ message: 'Failed tto create new order' });
        }
      }
    }
  );
});

router.get('/getAllProducts', (req, res) => {
  connection.query(
    'SELECT * FROM `product`, `priceByDate` WHERE product.priceByDateId = priceByDate.priceByDateId',
    function(err, results) {
      console.log(results);
      res.send(results);
    }
  )
});

router.post('/loginAuth', (req, res) => {
  const { userName, password } = req.body;
  connection.query('SELECT staffId, password, role, isActive FROM Staff WHERE username=?', [userName], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (results.length === 0) {
        // Không tìm thấy tên người dùng trong cơ sở dữ liệu
        res.status(401).send({ message: 'Incorrect user name or password' });
      } else {
        const staff = results[0];
        if (staff.password === password) {
          // Đăng nhập thành công
          res.status(200).send({
            staffId: staff.staffId,
            role: staff.role,
            isActive: staff.isActive
          });
        } else {
          // Sai mật khẩu
          res.status(401).send({ message: 'Incorrect user name or password' });
        }
      }
    }
  });
});

router.post('/addProduct', (req, res) => {
  const { expired, brand, cost, category, unit, condition, instock, sold, pricebydateId, promotionId } = req.body;
  connection.query(
    'INSERT INTO `product` (`productId`, `expired`, `brand`, `cost`, `category`, `unit`, `condition`, `instock`, `sold`, `pricebydateId`, `promotionId`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [uuidv4(), expired, brand, cost, category, unit, condition, instock, sold, pricebydateId, promotionId],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (results.affectedRows === 1) {
          res.status(200).send({ message: 'Product inserted successfully' });
        } else {
          res.status(401).send({ message: 'Failed to insert product' });
        }
      }
    }
  );
});

router.post('/updateProduct', (req, res) => {
  const { updateId, expired, brand, cost, category, unit, condition, instock, sold, pricebydateId, promotionId } = req.body;
  connection.query(
    'UPDATE `product` SET `expired`=?, `brand`=?, `cost`=?, `category`=?, `unit`=?, `condition`=?, `instock`=?, `sold`=?, `pricebydateId`=?, `promotionId`=? WHERE `productId`=?',
    [expired, brand, cost, category, unit, condition, instock, sold, pricebydateId, promotionId, updateId],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (results.affectedRows === 1) {
          res.status(200).send({ message: 'Successfully to update product' });
        } else {
          res.status(401).send({ message: 'Failed to update product' });
        }
      }
    }
  );
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

