import dotenv from 'dotenv';
dotenv.config();

const SERVER_HOSTNAME: string = process.env.HOSTNAME || 'localhost';
const SERVER_PORT: number = process.env.PORT ? +process.env.PORT : 5000;

const SERVER = {
	hostname: SERVER_HOSTNAME,
	port: SERVER_PORT,
};

const MONGODB_URL: string | undefined = process.env.MONGODB_URL;

const MONGODB_OPTIONS = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
};

const MONGODB = {
	url: MONGODB_URL,
	options: MONGODB_OPTIONS,
};

const TOKEN_SECRET: string = process.env.TOKEN_SECRET || 'secret';
const TOKEN_ISSUER: string = process.env.TOKEN_ISSUER || 'issuer';
const TOKEN_EXPIRE_TIME: string = process.env.TOKEN_EXPIRE_TIME || '7d';

const TOKEN = {
	secret: TOKEN_SECRET,
	issuer: TOKEN_ISSUER,
	expireTime: TOKEN_EXPIRE_TIME,
};

const config = {
	server: SERVER,
	mongodb: MONGODB,
	token: TOKEN,
};

export default config;
