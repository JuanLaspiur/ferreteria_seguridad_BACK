const mercadopago = require('mercadopago');
require('dotenv').config();
const { Order} = require('../models');
const Message = require('../models/message')
const {sendMessageNotification} = require('../helpers/send-notifications')


mercadopago.configure({
  access_token: `${process.env.MPAGO_TOKEN}`
});

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
    console.error('Pago   ' + JSON.stringify(payment));

    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(payment["data.id"]);
      console.error('Data importante  ' + JSON.stringify(data.response.status));

      const status = data.response.status;
      if (status == 'approved') {
        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        order.payed = true;
        order.status = "paid";
        await order.save();

        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;


        // Envío del mensaje
        const message = new Message({
          sender: order.buyer._id, // Ajusta según tu modelo de datos
          chat: order.chat._id,
          text: `CHUM le informa que el cliente  ha efectuado el pago de $${order.total} para su compra mediante la plataforma de MercadoPago con éxito.\n\nfecha: ${formattedDate}\nnro de orden: ${order._id}
           `
        });
        await message.save();

        sendMessageNotification(order.seller._id, 'Orden pagada ', `nro de orden: ${order._id}`);
        sendMessageNotification(order.seller._id, 'Mensaje de CHUM ', message.text);

      }
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