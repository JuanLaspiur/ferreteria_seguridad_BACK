const { response } = require('express');
const { Demand, User, Offer } = require('../models');

module.exports = {
  createDemand: async (req, res = response) => {
    const { type, location, paymentType, products } = req.body;
    try {
      locationTemp = location.replace('[', '').replace(']', '');

      locationTemp = locationTemp.split(',');

      const data = {
        user: req.user._id,
        type,
        location: {
          type: 'Point',
          coordinates: [locationTemp[1], locationTemp[0]],
        },
        paymentType,
        products,
      };
      const demand = new Demand(data);
      await demand.save();
      return res.status(201).json(demand);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  getDemands: async (req, res = response) => {
    const { limit = 5, skip = 0, lat, lng, radio } = req.query;
    radiotemp = radio ? radio / 6378.1 : 0.1 / 6378.1;

    try {
      if (lat && lng) {
        const [total, demands] = await Promise.all([
          Demand.countDocuments({
            location: {
              $geoWithin: {
                $centerSphere: [[lng, lat], radiotemp ? radiotemp : 0.1],
              },
            },
          }),
          Demand.find({
            location: {
              $geoWithin: {
                $centerSphere: [[lng, lat], radio ? radio : 0.1],
              },
            },
          })
            .populate([
              {
                path: 'offers',
                select: 'seller',
                populate: {
                  path: 'seller',
                  select: 'name',
                  model: User,
                },
              },
            ])
            .limit(Number(limit))
            .skip(Number(skip))
            .sort({ createdAt: -1 }),
        ]);
        return res.json({ total, demands });
      }

      const [total, demands] = await Promise.all([
        Demand.countDocuments({}),
        Demand.find({})
          // .populate([
          //   {
          //     path: 'offers',
          //     select: 'seller',
          //     populate: {
          //       path: 'seller',
          //       select: 'name',
          //       model: User,
          //     },
          //   },
          // ])
          .limit(Number(limit))
          .skip(Number(skip))
          .sort({ createdAt: -1 }),

        ,
      ]);

      return res.json({ total, demands });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  getMyDemands: async (req, res = response) => {
    const { limit = 5, skip = 0 } = req.query;
    try {
      const [total, demands] = await Promise.all([
        Demand.countDocuments({
          user: req.user._id,
        }),
        Demand.find({ user: req.user._id })
          .limit(Number(limit))
          .skip(Number(skip))
          .populate([
            {
              path: 'offers',
              select: {
                seller: {
                  name: true,
                  _id: true,
                  avatar: true,
                },
              },
            },
          ])
          .sort({ createdAt: -1 }),
      ]);

      return res.json({ total, demands });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  getDemand: async (req, res = response) => {
    const { id } = req.params;

    try {
      const demand = await Demand.findById(id).populate([
        {
          path: 'offers',
          select: {
            seller: {
              name: true,
              _id: true,
              avatar: true,
            },
          },
        },
      ]);

      if (!demand) {
        return res.status(404).json({ msg: 'Demand not found' });
      }
      const offers = await Offer.find({ demand });
      if (offers) {
        demand.offers = offers;
      }

      if (demand.user.toString() !== req.user._id.toString()) {
        demand.offers = demand.offers.filter(
          (offer) => offer.seller.toString() === req.user._id.toString(),
        );
      }

      return res.json({ msg: 'ok', demand });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  updateDemand: async (req, res = response) => {
    const { id } = req.params;

    const { state, ...data } = req.body;
    try {
      const demand = await Demand.findByIdAndUpdate(id, data, { new: true });
      return res.json(demand);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  deleteDemand: async (req, res = response) => {
    const { id } = req.params;
    try {
      const demand = await Demand.findByIdAndUpdate(id, {
        new: true,
      });

      return res.json(demand);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
};
