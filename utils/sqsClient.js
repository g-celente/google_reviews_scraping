require('dotenv').config();
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({ region: process.env.REGION }); 

const sendMessage = async (queueUrl, messageBody) => {
  try {
    const params = {
      QueueUrl: queueUrl, 
      MessageBody: JSON.stringify(messageBody),
    };

    const command = new SendMessageCommand(params);
      
    const data = await sqs.send(command);
      
    console.log("Mensagem enviada com sucesso:", data.MessageId);
    return data;
  } catch (error) {
    console.error("Erro ao enviar a mensagem para o SQS:", error);
      throw error;
  }
};

module.exports = {
  sendMessage,
};
