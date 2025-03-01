const sqsClient = require('../utils/sqsClient.js');
const Joi = require("joi");
const handlerError = require('../helpers/functions.js');
require('dotenv').config();

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

const storeSchema = Joi.object({
  placeId: Joi.string().required(),
  name: Joi.string().required()
});

const storesSchema = Joi.array().items(storeSchema).required();

exports.fetchStoresHandler = async (event) => {
  try {
    const stores = JSON.parse(event.body);
    const { error } = storesSchema.validate(stores);

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Dados inválidos, por favor insira-os novamente",
          details: error.details
        })
      };
    }

    await processStores(stores);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Lojas processadas com sucesso!' }),
    };
  } catch (error) {
    return handlerError(error, "Erro ao processar as lojas", 500);
  }
}

async function processStores(stores) {
  for (const store of stores) {
    const placeId = store.placeId;
    const name = store.name;

    try {
      await sqsClient.sendMessage(SQS_QUEUE_URL, { place_id: placeId, name });
      console.log(`Loja enviada para a fila SQS da AWS: ${name}`);
    } catch (error) {
      console.error("Erro ao enviar para a fila SQS:", error);
    }
  }
}
