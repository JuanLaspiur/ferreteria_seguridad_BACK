const mercadopago = require('mercadopago');
require('dotenv').config();

mercadopago.configure({
  access_token: `${process.env.MPAGO_TOKEN}`
});

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
    res.json(result.body.init_point);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something goes wrong Juancito" });
  }
};
module.exports = {
  createOrderMERCADOPAGO
};