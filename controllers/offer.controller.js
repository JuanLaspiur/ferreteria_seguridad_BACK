const { response } = require('express');
const { Offer, Demand } = require('../models');

module.exports = {
  createOffer : async (req, res = response) => {
    const { seller, demand, products, delivery } = req.body;
  
    try {
      const demandFound = await Demand.findById(demand);
  
      if (!demandFound) {
        return res.status(404).json({ msg: 'Demand not found' });
      }
  
      const total = products.reduce((acc, product) => {
        return acc + (product.price * product.quantity);
      }, 0);
  
      const offer = new Offer({
        seller,
        demand,
        products,
        delivery,
        total,
      });
  
      await offer.save();
  
      demandFound.offers.push(offer._id);
      await demandFound.save();
  
      return res.status(201).json(offer);
    } catch (error) {
      console.error('Error creating offer:', error);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }
  ,
  getOffers: async (req, res = response) => {
    const { limit = 5, skip = 0 } = req.query;
    try {
      const [total, offers] = await Promise.all([
        Offer.countDocuments({
          seller: req.user._id,
        }),
        Offer.find({
          seller: req.user._id,
        })
          .limit(Number(limit))
          .skip(Number(skip))
          .populate('order')
          .populate('seller', ['name', 'avatar'])
          .sort({ createdAt: -1 }),
      ]);

      return res.json({ total, offers });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  getMyOffers: async (req, res = response) => {
    const offersAccepted = await Offer.countDocuments({
      seller: req.user._id,
      status: 'accepted',
    });
    const offersRejected = await Offer.countDocuments({
      seller: req.user._id,
      state: 'rejected',
    });
    return res.json({ offersAccepted, offersRejected });
  },
  getOffer: async (req, res = response) => {
    const { id } = req.params;

    try {
      const offer = await Offer.findById(id)
        .populate('order')
        .populate('demand')
        .populate('seller', ['name', 'avatar']);
      //check if offer seller is req.user._id or offer.demand.user
      if (!offer) {
        return res.status(404).json({ msg: 'Offer not found' });
      }
      // if (
      //   offer.seller.toString() !== req.user._id.toString() &&
      //   offer.demand.user.toString() !== req.user._id.toString()
      // ) {
      //   return res.status(401).json({ msg: 'Unauthorized' });
      // }

      return res.json({ msg: 'ok', offer });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  updateOffer: async (req, res = response) => {
    const { id } = req.params;

    const { state, ...data } = req.body;

    var total = 0;
    data.products.forEach((element) => {
      total += element.price * element.quantity;
    });
    data.total = total;

    try {
      const offer = await Offer.findByIdAndUpdate(id, data, { new: true });
      return res.json(offer);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  deleteOffer: async (req, res = response) => {
    const { id } = req.params;
    try {
      const offer = await Offer.findByIdAndUpdate(id, {
        new: true,
      });

      return res.json(offer);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
   getOffersByDemandId : async (req, res = response) => {
    const { demandId } = req.params;
  
    try {
      const offers = await Offer.find({ demand: demandId })
        .populate('order')
        .populate('seller', ['name', 'avatar']);
  
      if (!offers || offers.length === 0) {
        return res.status(404).json({ msg: 'No se encontraron ofertas para esta demanda' });
      }
  
      return res.json({ offers });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: `Ha ocurrido un error: ${error.message}` });
    }
  }
  
};
