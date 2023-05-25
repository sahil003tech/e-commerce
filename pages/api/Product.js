import { mongooseConnect } from "@/lib/mongoose";
import { Products } from "@/model/Product";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Products.findOne({ _id: req.query.id }));
    } else {
      res.json(await Products.find());
    }
  }

  if (method === "POST") {
    const { title, description, price, images, category } = req.body;
    const productDoc = await Products.create({
      title,
      description,
      price,
      images,
      category,
    });
    res.json(productDoc);
  }

  if (method === "PUT") {
    const { title, description, price, _id, images, category } = req.body;
    await Products.updateOne(
      { _id },
      { title, description, price, images, category }
    );
    res.json(true);
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await Products.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
