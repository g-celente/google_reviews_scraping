const sqsClient = require('../utils/sqsClient.js')
const Joi = require("joi")

const storeSchema = Joi.object({
  placeId: Joi.string().required(),
  name: Joi.string().required()
})

const storesSchema = Joi.array().items(storeSchema).required();


exports.fetchStoresHandler = async (event) => {
  try {
    const stores = JSON.parse(event.body);

    const { error } = storesSchema.validate(stores)

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Dados inválidos, por favor insira-os novamente",
          details: error.details
        })
      }
    }

    processStores(stores)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Lojas processadas com sucesso!' }),
    };
  } catch (error) {
    return handlerError(error, "Erro ao processar as lojas", 500)
  }
}

async function processStores(stores) {
  for (const store of stores) {
    const placeId = store.place_id
    const name = store.name

    try {
      await sqsClient.sendMessage(SQS_QUEUE_URL, {
        place_id: placeId,
        name: name,
      });
      console.log(`Loja enviada para a fila SQS: ${name}`);
    } catch (error) {
      return handlerError(error, "Problema ao enviar item para a fila sqs", 400)
    }

  }
}

const handlerError = (error, message, statusCode) => {
  console.log(message, error)
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message,
      error: error.details
    })
  }
}