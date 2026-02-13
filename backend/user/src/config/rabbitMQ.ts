import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();
 const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname : process.env.RABBITMQ_HOST,
            port : parseInt(process.env.RABBITMQ_PORT || '5672'),
            username : process.env.RABBITMQ_USER,
            password : process.env.RABBITMQ_PASSWORD
        })

        const channel = await connection.createChannel();
        console.log("✅ Connected to RabbitMQ successfully!");
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
}

export default connectToRabbitMQ;