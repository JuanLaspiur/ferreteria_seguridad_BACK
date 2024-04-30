import mercadopago from 'mercadopago';
require('dotenv').config();


export const createOrderMERCADOPAGO = async (req, res) => {
  const { user, name, category, price, quantity } = req.body;

  mercadopago.configure({
      access_token: `${process.env.MPAGO_TOKEN}`
  });

  /*
      PRODUCTO
      name,
      price,
      category,
      description,
      user: req.user._id,
  */

  try {
      const result = await mercadopago.preferences.create({
          items: [
              {
                  id: user,
                  description: category ,
                  title: name,
                  unit_price:price,
                 // currency_id,
                  quantity,
              },
          ]
      });
      res.json(result.body.init_point);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something goes wrong" });
  }
}

export const aceptarOrden = (req,res) => {res.send('Orden aceptada') } ;
export const RecibirWebHook = async(req, res) => {
    try {
        const payment = req.query;
        console.log(payment);
        if (payment.type === "payment") {
          const data = await mercadopage.payment.findById(payment["data.id"]);
          console.log(data);
        }
    
        res.sendStatus(204);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something goes wrong" });
      }
};