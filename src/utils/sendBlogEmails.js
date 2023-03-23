const nodemailer = require("nodemailer")
const path = require('path')

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.MAIL,
		pass: process.env.MAILPASS,
	},
})

const receiveEmail = async mailBody => {
	let info = await transporter.sendMail({
		to: mailBody.to, // list of receivers
		from: mailBody.from, // sender address
		replyTo: mailBody.replyTo,
		subject: mailBody.subject, // Subject line
		text: mailBody.text, // plain text body
		html: mailBody.html,
		disableUrlAccess: true,
		disableFileAccess: true
	})

	return info
}


const sendEmail = async mailBody => {
	let info = await transporter.sendMail({
		to: mailBody.to, // list of receivers
		from: mailBody.from, // sender address
		replyTo: mailBody.replyTo,
		subject: mailBody.subject, // Subject line
		text: mailBody.text, // plain text body
		html: mailBody.html, // html body
		attachments: [{
			filename: 'logo_odonto_topo.png',
			path: path.join(process.cwd(), '/public/assets/media/', 'logo_odonto_topo.png'),
			cid: 'logo_odonto_topo' //same cid value as in the html img src
		}],
		disableUrlAccess: false,
		disableFileAccess: false
	})

	return info
}

module.exports = { sendEmail, receiveEmail }
