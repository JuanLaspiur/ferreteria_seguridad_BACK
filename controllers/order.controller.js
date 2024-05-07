const { response } = require('express');
const { Order, Chat, Offer } = require('../models');

module.exports = {
  createOrder: async (req, res = response) => {
    const { offer, mercado_pago } = req.body;

    const orderfound = await Order.findOne({ offer, buyer: req.user._id });
    if (orderfound) {
      return res.status(400).json({
        msg: `La ordend de la ${offer} ya existe`,
      });
    }
    const offerFound = await Offer.findById(offer);
    if (!offerFound) {
      return res.status(400).json({
        msg: `La oferta no existe`,
      });
    }

    const data = {
      buyer: req.user._id,
      offer,
      delivery: offerFound.delivery,
      total: offerFound.total,
      seller: offerFound.seller,
      mercado_pago
    };

    const order = new Order(data);
    const chat = new Chat({
      order: order._id,
      buyer: req.user._id,
      seller: offerFound.seller,
    });
    await chat.save();
    order.chat = chat._id;
    await order.save();
    offerFound.status = 'accepted';
    offerFound.order = order;
    await offerFound.save();

    return res.status(201).json(order);
  },
  getOrders: async (req, res = response) => {
    const { limit = 5, skip = 0 } = req.query;
    try {
      const [total, orders] = await Promise.all([
        Order.countDocuments({
          $or: [
            { buyer: req.user._id },
            {
              seller: req.user._id,
            },
          ],
        }),

        Order.find({
          $or: [
            { buyer: req.user._id },

            {
              seller: req.user._id,
            },
          ],
        })
          .limit(Number(limit))
          .skip(Number(skip))
          .populate('seller', ['name', 'avatar'])
          .populate('buyer', ['name', 'avatar'])
          .populate('offer')
          .populate('chat')
          .sort({ createdAt: -1 }),
      ]);

      return res.json({ total, orders });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  getOrder: async (req, res = response) => {
    const { id } = req.params;

    try {
      const order = await Order.findById(id)
        .populate('offer')
        .populate('chat')
        .populate('buyer', ['name', 'avatar'])
        .populate('seller', ['name', 'avatar']);

      if (!order) {
        return res.status(400).json({ msg: 'La orden no existe' });
      }
      //order buyer or offer seller
      // if (
      //   order.buyer.toString() !== req.user._id.toString() &&
      //   order.seller.toString() !== req.user._id.toString()
      // ) {
      //   return res.status(400).json({ msg: 'No tiene permisos' });
      // }

      return res.json({ msg: 'ok', order });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  updateOrder: async (req, res = response) => {
    const { id } = req.params;

    const { state, ...data } = req.body;

    var total = 0;
    data.offer.forEach((element) => {
      total += element.price * element.quantity;
    });
    data.total = total;
    try {
      const order = await Order.findByIdAndUpdate(id, data, { new: true });
      return res.json(order);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  updateOrderStatus: async (req, res = response) => { 
    try {
      const { id } = req.params;
      const { status } = req.body;  
      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      if (!order) {
        return res.status(400).json({ msg: 'La orden no existe' });
      }
  
      // Devuelve la orden actualizada como respuesta
      return res.json(order);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: `Ha ocurrido un error: ${error.message}` });
    }
  }
  
  ,
  deleteOrder: async (req, res = response) => {
    const { id } = req.params;
    try {
      const order = await Order.findByIdAndUpdate(id, {
        new: true,
      });

      return res.json(order);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
};
