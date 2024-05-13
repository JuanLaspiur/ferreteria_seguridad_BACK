const mercadopago = require('mercadopago');
require('dotenv').config();
const { Order} = require('../models');

mercadopago.configure({
  access_token: `${process.env.MPAGO_TOKEN}`
});
/*
 const createOrderMERCADOPAGO = async (req, res) => {
  try { 
    const { user, name, category, price, quantity } = req.body;
    const result = await mercadopago.preferences.create({
        items: [
            {
                id: user,
                description: category ,
                title: name,
                unit_price:price,
                currency_id: "CLP",
                quantity:quantity,
            },
        ]
    });
    res.json({"url":result.body.init_point});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something goes wrong" });
  }
}; */
const createOrderMERCADOPAGO = async (req, res) => {

const {listProduct, order} = req.body;

  try { 
    const items = listProduct.map(product => ({
      id: product.user,
      description: product.category,
      title: product.name,
      unit_price: product.price,
      currency_id: "CLP",
      quantity: product.quantity,
    }
  ));

    const result = await mercadopago.preferences.create({
      items: items,
       notification_url: `${process.env.BACK_URL}mpago/webHook?orderId=${order._id}`
    });
    
    res.json({"url": result.body.init_point});


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const webHook = async (req, res) => {
  console.log('Entré'); 
  try {
    const payment = req.query;
    const { orderId } = req.query; 
    console.error('Pago   ' + payment);

    if (payment.type === "payment") {
     const order = await Order.findById(orderId);
     if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.payed = true;
    order.status = "paid";
                
    await order.save();

    }

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" });
  }

}


module.exports = {
  createOrderMERCADOPAGO,
  webHook
};