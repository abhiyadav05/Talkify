import amqp from 'amqplib'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

export const startSendOtp = async ()=>{
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname : process.env.RABBITMQ_HOST,
            port : parseInt(process.env.RABBITMQ_PORT || '5672'),
            username : process.env.RABBITMQ_USER,
            password : process.env.RABBITMQ_PASSWORD
        })
        const queueName="send-otp";
        const channel=connection.createChannel();
        (await channel).assertQueue(queueName,{durable:true});
        console.log("🦕RabbitMQ is connected... ");


        // consumming the message 
        (await channel).consume(queueName,async (message)=>{
            if(message){
                try {
                    const {to,subject,body}=JSON.parse(message.content.toString());

                    // now the message dump into the mail

                    const transporter= nodemailer.createTransport(
                        {
                            host : 'smtp.gmail.com',
                            port : 465,
                            auth : {
                                user : process.env.NODEMAILER_USER,
                                pass : process.env.NODEMAILER_PASS
                            }
                        }
                    );

                    // send mail 
                    console.log(to);
                    await transporter.sendMail({
                        from: process.env.NODEMAILER_USER, // use an actual email as sender
                        to,
                        subject,
                        text: body,
                    });

                    console.log(`mail send to ${to}`);
                    (await channel).ack(message);


                } catch (error) {
                    console.log("Failed to send otp..")
                }
            }else{
                console.log("Message not found ...")
            }
        })
    } catch (error) {
        console.log("Connection of RabbitMQ is failed..")
    }
}