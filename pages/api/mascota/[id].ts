// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { conn } from "../../../database/connection";
import Cors from 'cors';


function initMiddleware(middleware: any) {
  return (req:any, res:any) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result:any) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

const cors = initMiddleware(
  Cors({
    methods: ['OPTIONS', 'GET'],
  })
);

export default async function Mascota(
  request: NextApiRequest,
  response: NextApiResponse
) {

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
  const { id } = request.query;

  //consultando juguete
  const query = `select mascotas.name,
                  mascotas.description,
                  mascotas.stock,
                  mascotas.imagen, 
                  mascotas.precio,
                  mascotas.descuento  
                  from mascotas 
                inner join raza 
                on raza.id = mascotas.idraza 
                where mascotas.id =  $1`;
  const value = [id];
  const responseDB = await conn.query(query, value);

  //consultando detalle de la mascota
  const queryDetalle = `select peso,
                          estatura_promedio,
                          vida,
                          actividad_fisica,
                          clima_recomendado,
                          caracter
                        from caracteristicas 
                        where idmascotas =  $1`;
  const valueDetalle = [id];
  const responseDBDetalle = await conn.query(queryDetalle, valueDetalle);

  let objResponse = {
    ...responseDB.rows[0],
    detalles: {
      ...responseDBDetalle.rows[0],
    },
  };

  return response.status(200).json(objResponse);

};
