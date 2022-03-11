import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import config from './config/config';
// import blogRoutes from './routes/blogRoutes';
// import userRoutes from './routes/userRoutes';

const app: Application = express();

// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to database
{
	if (config.mongodb.url)
		mongoose
			.connect(config.mongodb.url, config.mongodb.options)
			.then((result) => {
				console.log('Connected to MongoDB database');
				app.listen(config.server.port, () =>
					console.log(
						`Server running at http://${config.server.hostname}:${config.server.port}...`
					)
				);
			})
			.catch((error: Error) => {
				console.error(error);
				process.exit(1);
			});
}

// routes
// home
app.get('/', (request: Request, response: Response) => {
	response.redirect('/api/blogs');
});

// blogs
// app.use('/api/blogs', blogRoutes);

// users
// app.use('/api/users', userRoutes);

// 404
app.use((request: Request, response: Response) => {
	response.status(404).send('<h1>404</h1>Page Not Found :(');
});
