// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { conn } from "../../database/connection";
import Cors from "cors";

function initMiddleware(middleware: any) {
  return (req: any, res: any) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["OPTIONS", "GET"],
  })
);

export default async function Mascota(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // Run cors
  await cors(request, response);

  switch (request.method) {
    case "GET":
      return getLitApi(request, response);

    default:
      return response.status(400).json({
        field: 400,
        message: "Bad request",
      });
  }
}

const getLitApi = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  console.log("ddddd");
  // const id = 13;
  const query =
    "select mascotas.id, mascotas.name, mascotas.description, mascotas.stock,  mascotas.imagen,  mascotas.precio,  mascotas.descuento,raza.nombre  from mascotas inner join raza  on raza.id = mascotas.idraza ";
  // const value = [id];
  const responseDB = await conn.query(query);

  return response.status(200).json(responseDB.rows);
  // return response.status(200).json([]);
};
