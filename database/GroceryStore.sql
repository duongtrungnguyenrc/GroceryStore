CREATE DATABASE GroceryStore
USE GroceryStore 
CREATE TABLE priceByDate
(
  pricebydateId varchar(100),
  date datetime,
  price INT,
  PRIMARY KEY (pricebydateId)
);

CREATE TABLE customer
(
  customerId varchar(100),
  class varchar(100),
  accumlatedPoints INT,
  name varchar(100) ,
  address varchar(100),
  phone varchar(15),  
  gender varchar(10),
  dayofbirth date,
  PRIMARY KEY (customerId)
);

CREATE TABLE promotion
(
  promotionId varchar(100),
  percentage float,
  PRIMARY KEY (promotionId)
);

CREATE TABLE suppier
(
  suppierId varchar(100),
  name varchar(100),
  address varchar(100),
  PRIMARY KEY (suppierId)
);

CREATE TABLE staff
(
  staffId varchar(100),
  salary int,
  name varchar(100),
  address varchar(100),
  phone varchar(15),
  gender varchar(10),
  dayofbirth date,
  type varchar(50),
  isactive tinyint,
  PRIMARY KEY (staffId)
);

CREATE TABLE product
(
  productId varchar(100),
  expired INT,
  brand varchar(100),
  cost INT,
  category varchar(100),
  unit varchar(100),
  condition varchar(100),
  instock tinyint,
  sold INT,
  pricebydateId varchar(100),
  promotionId varchar(100),
  PRIMARY KEY (productId),
  FOREIGN KEY (pricebydateId) REFERENCES priceByDate(pricebydateId),
  FOREIGN KEY (promotionId) REFERENCES promotion(promotionId)
);

CREATE TABLE receipt
(
  receiptId varchar(100),
  date datetime,
  staffId varchar(100),
  suppierId varchar(100),
  PRIMARY KEY (receiptId),
  FOREIGN KEY (staffId) REFERENCES staff(staffId),
  FOREIGN KEY (suppierId) REFERENCES suppier(suppierId)
);

CREATE TABLE listOrder
(
  orderId varchar(100),
  totalAmount INT,
  totalPrice INT,
  createdAt varchar(100),
  discount INT,
  customerId varchar(100),
  PRIMARY KEY (orderId),
  FOREIGN KEY (customerId) REFERENCES customer(customerId),
  FOREIGN KEY (createdAt) REFERENCES staff(staffId)
);

CREATE TABLE orderLine
(
  orderlineId varchar(100),
  quantity INT,
  salePrice INT,
  productId varchar(100),
  orderId varchar(100),
  PRIMARY KEY (orderlineId),
  FOREIGN KEY (productId) REFERENCES product(productId),
  FOREIGN KEY (orderId) REFERENCES listOrder(orderId)
);