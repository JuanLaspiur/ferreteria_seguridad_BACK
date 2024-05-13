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
      back_urls:{
        success:`${process.env.BACK_URL}webHook?orderId=${order._id}`
      },
    //  notification_url: `${process.env.BACK_URL}webHook?orderId=${order._id}`
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
    const { orderId } = req.query; 
    console.log('ID de la orden:', orderId);

    // Busca la orden en la base de datos utilizando el ID capturado
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Marca la orden como pagada
    order.payed = true;
    await order.save();

    console.log('Orden marcada como pagada:', order);

    res.sendStatus(204); // Envía una respuesta exitosa
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  createOrderMERCADOPAGO,
  webHook
};