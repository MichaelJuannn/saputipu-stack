import Fastify, { FastifyRequest } from 'fastify';
const fastify = Fastify({ logger: true });
import * as child from 'child_process';

type Prediction = {
	input: string;
};

function getPrediction(input: string) {
	return new Promise((resolve, reject) => {
		const python = child.spawn('python', ['./python/main.py', input]);
		let output = '';
		python.stdout.on('data', (data) => {
			output += data.toString();
		});
		python.stderr.on('data', (err) => {});
		python.on('close', (code) => {
			if (code !== 0) {
				reject(`Process exited with code ${code}`);
			} else {
				const lines = output.split('\n').filter(Boolean);
				const lastLine = lines[lines.length - 1].replace('\r', '');
				resolve(lastLine);
			}
		});
	});
}
fastify
	.post<{ Body: Prediction }>('/post', async (request, reply) => {
		const input = request.body.input;
		let prediction = (await getPrediction(input)) as string;
		prediction = prediction.replace(/\s+/g, ',');
		let prediction_array = JSON.parse(prediction);
		console.log(prediction_array);
		return { prediction_array };
	})
	.get('/test', async (request, reply) => {
		return { hello: 'world' };
	});

const start = async () => {
	try {
		await fastify.listen({ port: 3000 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
