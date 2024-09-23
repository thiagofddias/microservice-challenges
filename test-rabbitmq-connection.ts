import * as amqp from 'amqplib';

async function testConnection() {
  const rabbitmqUser = 'dev';
  const rabbitmqPassword = 'devpass';
  const rabbitmqUrl = '18.210.17.173:5672/smartranking';

  const connectionString = `amqp://${rabbitmqUser}:${rabbitmqPassword}@${rabbitmqUrl}`;

  try {
    const connection = await amqp.connect(connectionString);
    console.log('Connected to RabbitMQ');
    await connection.close();
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
}

testConnection();
