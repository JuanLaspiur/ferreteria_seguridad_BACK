const { response } = require('express');
const { Service } = require('../models');

module.exports = {
  createService: async (req, res = response) => {
    const { name } = req.body;

    const data = {
      name,
    };

    const service = new Service(data);
    await service.save();

    return res.status(201).json(service);
  },
  getServices: async (req, res = response) => {
    const { limit = 5, skip = 0 } = req.query;

    try {
      const [total, services] = await Promise.all([
        Service.countDocuments({}),
        Service.find({}).limit(Number(limit)).skip(Number(skip)),
      ]);

      return res.json({ total, services });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },

  getService: async (req, res = response) => {
    const { id } = req.params;

    try {
      //check id user populate
      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ msg: 'Service not found' });
      }
      const offers = await Offer.find({ service });
      if (offers) {
        service.offers = offers;
      }

      if (service.user.toString() !== req.user._id.toString()) {
        service.offers = service.offers.filter(
          (offer) => offer.seller.toString() === req.user._id.toString(),
        );
      }

      return res.json({ msg: 'ok', service });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  updateService: async (req, res = response) => {
    const { id } = req.params;

    const { state, ...data } = req.body;
    try {
      const service = await Service.findByIdAndUpdate(id, data, { new: true });
      return res.json(service);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  deleteService: async (req, res = response) => {
    const { id } = req.params;
    try {
      const service = await Service.findByIdAndUpdate(id, {
        new: true,
      });

      return res.json(service);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
};
