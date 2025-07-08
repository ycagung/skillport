import { env } from '$env/dynamic/private';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
	host: env.SMTP_SERVER,
	port: Number(env.SMTP_PORT),
	auth: {
		user: env.SMTP_LOGIN,
		pass: env.SMTP_PASSWORD
	},
	tls: {
		rejectUnauthorized: false
	}
});
