const mercadopago = require('mercadopago');
require('dotenv').config();

mercadopago.configure({
  access_token: `${process.env.MPAGO_TOKEN}`
});

export const createOrderMERCADOPAGO = async (req, res) => {
  const { user, name, category, price, quantity } = req.body;

  try {
    const result = await mercadopago.preferences.create({
        items: [
            {
                id: user,
                description: category ,
                title: name,
                unit_price:price,
                quantity,
            },
        ]
    });
    res.json(result.body.init_point);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something goes wrong" });
  }
};
