import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

let channel:amqp.Channel;
 export const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname : process.env.RABBITMQ_HOST,
            port : parseInt(process.env.RABBITMQ_PORT || '5672'),
            username : process.env.RABBITMQ_USER,
            password : process.env.RABBITMQ_PASSWORD
        })

         channel = await connection.createChannel();
        console.log("✅ Connected to RabbitMQ successfully!");
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
}

export const publishToQueue= async (queueName:string,message:any)=>{
      if(!channel){
        console.log("channel is not initialized");
      }
      console.log(message.to);
      await channel.assertQueue(queueName,{durable : true});
      channel.sendToQueue(queueName,
       Buffer.from(JSON.stringify(message)),
        {persistent:true});
}