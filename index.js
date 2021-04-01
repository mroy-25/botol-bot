const
	{
		WAConnection,
		MessageType,
		Presence,
		MessageOptions,
		Mimetype,
		WALocationMessage,
		WA_MESSAGE_STUB_TYPES,
		ReconnectMode,
		ProxyAgent,
		GroupSettingChange,
		waChatKey,
		mentionedJid,
		processTime,
	} = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal")
const moment = require("moment-timezone")
const fs = require("fs")
const speed = require('performance-now')
const { Utils_1 } = require('./node_modules/@adiwajshing/baileys/lib/WAConnection/Utils')
const tiktod = require('tiktok-scraper')
const axios = require("axios")
const ffmpeg = require('fluent-ffmpeg')
const imageToBase64 = require('image-to-base64');
const { removeBackgroundFromImageFile } = require('remove.bg')
const { spawn, exec, execSync } = require("child_process")
const fetchs = require("node-superfetch");
const ms = require('parse-ms')
const toMs = require('ms')

/* ========================================================== */

const { wait, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { color, bgcolor } = require('./lib/color')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const { error } = require("qrcode-terminal")
const { exif } = require('./lib/exif')

/* ========================================================== */

/******************** D A T A B A S E*************************/

const left = JSON.parse(fs.readFileSync('./src/left.json'))
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const setiker = JSON.parse(fs.readFileSync('./src/stik.json'))
const videonye = JSON.parse(fs.readFileSync('./src/video.json'))
const audionye = JSON.parse(fs.readFileSync('./src/audio.json'))
const imagenye = JSON.parse(fs.readFileSync('./src/image.json'))
const config = JSON.parse(fs.readFileSync('./config.json'))
const time = moment().tz('Asia/Jakarta').format("HH:mm:ss")
const vcard = 'BEGIN:VCARD\n' 
            + 'VERSION:3.0\n' 
            + 'FN:Owner BOT\n' 
            + 'ORG: Creator Botol BOT;\n' 
            + `TEL;type=CELL;type=VOICE;waid=${config.ownerNumber}:${config.ownerNumber}\n`
            + 'END:VCARD'
/******************** D A T A B A S E*************************/

prefix = '.'
fake = 'BOTOL BOT'
numbernye = '0'
blocked = []

/******************** F U N C T I O N S************************/

function kyun(seconds) {
	function pad(s) {
		return (s < 10 ? '0' : '') + s;
	}
	var hours = Math.floor(seconds / (60 * 60));
	var minutes = Math.floor(seconds % (60 * 60) / 60);
	var seconds = Math.floor(seconds % 60);
	return `${pad(hours)}H ${pad(minutes)}M ${pad(seconds)}S`
}

function today(i) {
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
today = dd + '/' + mm + '/' + yyyy;
return today;
 }

async function starts() {
	const botol = new WAConnection()
	botol.logger.level = 'warn'
	console.log(banner.string)
	botol.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
	})

	fs.existsSync('./session.json') && botol.loadAuthInfo('./session.json')
	botol.on('connecting', () => {
		start('2', 'Connecting...')
	})
	botol.on('open', () => {
		success('2', 'Connected')
	})
	await botol.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./session.json', JSON.stringify(botol.base64EncodedAuthInfo(), null, '\t'))

	botol.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await botol.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await botol.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Halo @${num.split('@')[0]}\nSelamat datang di group *${mdata.subject}*`
				let buff = await getBuffer(ppimg)
				botol.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await botol.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Sayonara @${num.split('@')[0]}👋`
				let buff = await getBuffer(ppimg)
				botol.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})

	botol.on('CB:Blocklist', json => {
            if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

botol.on('chat-update', async (mek) => {
		try {
            if (!mek.hasNewMessage) return
            mek = mek.messages.all()[0]
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (!mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
                        const pushname = mek.key.fromMe ? botol.user.name : conts.notify || conts.vname || conts.name || '-'
			const type = Object.keys(mek.message)[0]
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)
                        const readmore = '͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏'

			mess = {
				wait: '⌛ Sedang di Prosess ⌛',
				success: '✔️ Berhasil ✔️',
				error: {
					stick: '❌ Gagal, terjadi kesalahan saat mengkonversi gambar ke sticker ❌',
					Iv: '❌ Link tidak valid ❌'
				},
				only: {
					group: '❌ Perintah ini hanya bisa di gunakan dalam group! ❌',
					ownerG: '❌ Perintah ini hanya bisa di gunakan oleh owner group! ❌',
					ownerB: '❌ Perintah ini hanya bisa di gunakan oleh owner bot! ❌',
					admin: '❌ Perintah ini hanya bisa di gunakan oleh admin group! ❌',
					Badmin: '❌ Perintah ini hanya bisa di gunakan ketika bot menjadi admin! ❌'
				}
			}

			const botNumber = botol.user.jid
			const ownerNumber = [`${config.ownerNumber}@s.whatsapp.net`] // replace this with your number
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await botol.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			let authorname = botol.contacts[from] != undefined ? botol.contacts[from].vname || botol.contacts[from].notify : undefined	
			if (authorname != undefined) { } else { authorname = groupName }	
			
			function addMetadata(packname, author) {	
				if (!packname) packname = `${config.packname}`; if (!author) author = `${config.author}`;	
				author = author.replace(/[^a-zA-Z0-9]/g, '');	
				let name = `${author}_${packname}`
				if (fs.existsSync(`./src/stickers/${name}.exif`)) return `./src/stickers/${name}.exif`
				const json = {	
					"sticker-pack-name": packname,
					"sticker-pack-publisher": author,
				}
				const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])	
				const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]	

				let len = JSON.stringify(json).length	
				let last	

				if (len > 256) {	
					len = len - 256	
					bytes.unshift(0x01)	
				} else {	
					bytes.unshift(0x00)	
				}	

				if (len < 16) {	
					last = len.toString(16)	
					last = "0" + len	
				} else {	
					last = len.toString(16)	
				}	

				const buf2 = Buffer.from(last, "hex")	
				const buf3 = Buffer.from(bytes)	
				const buf4 = Buffer.from(JSON.stringify(json))	

				const buffer = Buffer.concat([littleEndian, buf2, buf3, buf4])	

				fs.writeFile(`./src/stickers/${name}.exif`, buffer, (err) => {	
					return `./src/stickers/${name}.exif`	
				})	

			}

		const reply = (teks) => {
			botol.sendMessage(from, teks, text, { quoted: mek })
		}

		const sendMess = (hehe, teks) => {
			botol.sendMessage(hehe, teks, text)
		}

		const mentions = (teks, memberr, id) => {
			(id == null || id == undefined || id == false) ? botol.sendMessage(from, teks.trim(), extendedText, { contextInfo: { "mentionedJid": memberr } }) : botol.sendMessage(from, teks.trim(), extendedText, { quoted: mek, contextInfo: { "mentionedJid": memberr } })
		}

		const sendPtt = (audio) => {
			botol.sendMessage(from, audio, mp3, { quoted: mek })
		}
		
		const fakestatus = (teks) => {
			botol.sendMessage(from, teks, text, {
				quoted: {
					key: {
						fromMe: false,
						participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {})
					},
					message: {
						"imageMessage": {
							"url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc",
							"mimetype": "image/jpeg",
							"caption": fake,
							"fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=",
							"fileLength": "28777",
							"height": 1080,
							"width": 1079,
							"mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=",
							"fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=",
							"directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69",
							"mediaKeyTimestamp": "1610993486",
							"jpegThumbnail": fs.readFileSync('./src/image/thumbnail.jpeg'),
							"scansSidecar": "1W0XhfaAcDwc7xh1R8lca6Qg/1bB4naFCSngM2LKO2NoP5RI7K+zLw=="
						}
					}
				}
			})
		}
		const fakegroup = (teks) => {
			botol.sendMessage(from, teks, text, {
				quoted: {
					key: {
						fromMe: false,
						participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "6289523258649-1604595598@g.us" } : {})
					},
					message: {
						conversation: fake
					}
				}
			})
		}

			switch (command) {
                     case 'speed':
                    case 'ping':
            					const timestamp = speed();
            					const latensi = speed() - timestamp
            					exec(`neofetch --stdout`, (error, stdout, stderr) => {
            						const child = stdout.toString('utf-8')
            						const teks = child.replace(/Memory:/, "Ram:")
            						const pingnya = `${teks}📶 Speed: ${latensi.toFixed(4)} Second`
            						fakestatus(pingnya)
            					})
            					break
            				case 'ocr':
            				if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
            						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
            						const media = await botol.downloadAndSaveMediaMessage(encmedia)
            						reply(mess.wait)
            						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
            							.then(teks => {
            								reply(teks.trim())
            								fs.unlinkSync(media)
            							})
            							.catch(err => {
            								reply(err.message)
            								fs.unlinkSync(media)
            							})
            					} else {
            						reply(`Kirim foto dengan caption ${prefix}ocr`)
            					}
            					break
                    case 'help': 
                    case 'menu': {
                        const time2 = moment().tz('Asia/Jakarta').format('HH:mm:ss')
                                        if(time2 < "23:59:00"){
                                            var sselamat = 'SELAMAT MALAM'
                                        }
                                         if(time2 < "19:00:00"){
                                            var sselamat = 'SELAMAT PETANG'
                                         }
                                         if(time2 < "18:00:00"){
                                            var sselamat = 'SELAMAT SORE'
                                         }
                                         if(time2 < "15:00:00"){
                                            var sselamat = 'SELAMAT SIANG'
                                         }
                                         if(time2 < "11:00:00"){
                                            var sselamat = 'SELAMAT PAGI'
                                         }
                                        if(time2 < "05:00:00"){
                                                var sselamat = 'SELAMAT MALAM'
                                         }
                                         var d = new Date
                                            var locale = 'id'
                                            var gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
                                            var weton = ['Pahing', 'Pon','Wage','Kliwon','Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
                                            var week = d.toLocaleDateString(locale, { weekday: 'long' })
                                            var date = d.toLocaleDateString(locale, {                                                                                                      day: 'numeric',
                                              month: 'long',
                                              year: 'numeric'
                                            })
                                        var waktu = moment().tz('Asia/Jakarta').format("HH : mm : ss")
                        menunye = `*${sselamat}* *${sender.split('@')[0]}*

• *${week} ${weton}*
• *${date}*
• *${today(time)}*
• *${waktu}    WIB*
${readmore}
*BOTOL BOT MENU*

01. ${prefix}h -> hidetag
02. ${prefix}f -> forward
03. ${prefix}. -> eval
04. .runtime -> runtime
05. ${prefix}setnomor -> Set Nomor Reply
06. ${prefix}setpesan -> Set Pesan Reply
07. ${prefix}setprefix -> Set Prefix
08. ${prefix}toimg -> Convert to Image
09. ${prefix}stiker -> gambar/gif/video Sticker
10. ${prefix}meme -> Random Meme
11. ${prefix}imgtourl -> Image to url
12. ${prefix}memeimg -> Meme generator
13. ${prefix}tga -> Tag All
14. ${prefix}tga2 -> Tag All v2
15. ${prefix}tga3 -> Tag All v3
16. ${prefix}wait -> What Anime is This?
17. ${prefix}setnick -> Ganti Nickname WhatsApp kamu
18. ${prefix}setpict -> Ganti photo profile WhatsApp kamu <i> kirim gambar atau reply gambar dengan caption .setpict
19. ${prefix}delete -> Hapus pesan (personal/private atau grup)
20. ${prefix}hilih -> ih gisiki giliy
21. ${prefix}fto -> Forward to
22. ${prefix}grup -> Group Management
23. ${prefix}kontag -> Kontak dengan Tag
24. ${prefix}kontak -> Kirim Kontak
25. ${prefix}tomp3 -> Video to mp3
26. ${prefix}tr -> Terjemah bahasa asing
27. ${prefix}wasted -> Wasted generator
28. ${prefix}tobecontinue -> to be continued generator
29. ${prefix}thuglife -> Thug life Generator
27. ${prefix}trigger -> Trigger generator`
              fakestatus(menunye)
                    }
                    break
           case 'owner':
           case 'creator':
                  botol.sendMessage(from, {displayname: "Jeff", vcard: vcard}, MessageType.contact, { quoted: mek })
                  botol.sendMessage(from, 'Itu Nomor Owner ku', MessageType.text, { quoted: mek })
                  break
           case 'h':
                        var value = args.join(" ")
                        var grup = await botol.groupMetadata(from)
                        var member = grup['participants']
                        var mem = []
                        member.map( async adm => {
                            mem.push(adm.jid)
                        })
                        var options = {
                            text: value,
                            contextInfo: {
                                mentionedJid: mem
                            }
                        }
                        botol.sendMessage(from, options, text)
                        break
                    case 'f':
                        var value = args.join(" ")
                        var options = {
                            text: value,
                            contextInfo: {
                                participant: '0@s.whatsapp.net',
                                remoteJid: 'status@broadcast',
                                isForwarded: true,
                                forwardingScore: 300,
                                quotedMessage: {
                                    documentMessage: {
                                        fileName: fake,
                                        jpegThumbnail: gambar64,
                                        mimetype: 'application/pdf',
                                        pageCount: 200
                                    }
                                }
                            }
                        }
                        botol.sendMessage(from, options, text)
                        break
                    case '.':
                    let code = args.join(" ")
                try {

                if (!code) return botol.reply(from, 'No JavaScript Code', id)
                let evaled;

                if (code.includes("--silent") && code.includes("--async")) {
                code = code.replace("--async", "").replace("--silent", "");

                return await eval(`(async () => { ${code} })()`)
                } else if (code.includes("--async")) {
                code = code.replace("--async", "");
        
                evaled = await eval(`(async () => { ${code} })()`);
                } else if (code.includes("--silent")) {
                code = code.replace("--silent", "");
        
                return await eval(code);
                } else evaled = await eval(code);

              if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled, { depth: 0 });
  
            let output = clean(evaled);
            var options = {
                contextInfo: {
                    participant: '0@s.whatsapp.net',
                    quotedMessage: {
                        extendedTextMessage: {
                            text: "*EXECUTOR"
                        }
                    }
                }
            }
            botol.sendMessage(from, `${output}`, text, options)
            } catch(err) {
            console.error(err)
            reply(err)
            }
            function clean(text) {
            if (typeof text === "string")
              return text
                .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                .replace(/@/g, `@${String.fromCharCode(8203)}`);
            // eslint-disable-line prefer-template
            else return text;
            }
            break
            case 'setthumb':
            		if (!isQuotedImage) return reply('Reply image!')
            	        const messimagethumb = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
            		const downiamgethumb = await botol.downloadMediaMessage(messimagethumb)
            		fs.unlinkSync(`./src/image/thumbnail.jpeg`)
            	        await sleep(2000)
            		fs.writeFileSync(`./src/image/thumbnail.jpeg`, downiamgethumb)
            		fakestatus('Succes')
            		break
            case 'setprefix':
                if (args.length < 1) return
                prefix = args[0]
                reply(`*Prefix berhasil diubah ke ${prefix}*`)
                break
            case 'setnomor':
                if (args.length < 1) return
                numbernya = args[0]
                reply(`*Berhasil ubah nomor ke ${numbernya}*`)
                break
            case 'setpesan':
                if (args.length < 1) return
                fake = args.join(" ")
                reply(`*Berhasil mengubah pesan reply ke: ${fake}*`)
                break
            case 'runtime':
                runtime = process.uptime()
                teks = `${kyun(runtime)}`
                const rtime = {
                    contextInfo: {
                        participant: `${numbernya}@s.whatsapp.net`,
                        remoteJid: 'status@broadcast',
                        quotedMessage: {
                            extendedTextMessage: {
                                text: "-[ 𝙎𝙏𝘼𝙏𝙐𝙎 ]-"
                            }
                        }
                    }
                }
                botol.sendMessage(from, `${teks}`, text, rtime)
                break
            case 'toimg':
                if ((isQuotedSticker && mek.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated === false)) {
                    encmedia = JSON.parse(JSON.stringify(mek).replace("quotedM","m")).message.extendedTextMessage.contextInfo
                    media = await botol.downloadAndSaveMediaMessage(encmedia)
                    ran = getRandom('.png')
                    exec(`ffmpeg -i ${media} ${ran}`, (err) => {
                        fs.unlinkSync(media)
                        if (err) return reply('ada yang error')
                        buffer = fs.readFileSync(ran)
                        botol.sendMessage(from, buffer, image, {quoted:mek, caption: "nih dah jadi"})
                        fs.unlinkSync(ran)
                    })
                } else if ((isQuotedSticker && mek.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated)) {
                    encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
                    media = await botol.downloadAndSaveMediaMessage(encmedia)
                    ran = getRandom('.gif')
                    ranw = getRandom('.mp4')
                    spawn('./webp2gif', [
                        media,
                        ran
                    ]).on('error', (err) => {
                        reply(`Error: ${err}`).then(() => {
                            console.log(err)
                        })
                        fs.unlinkSync(media)
                    }).on('close', () => {
                        fs.unlinkSync(media)
                        exec(`ffmpeg -i ${ran} -pix_fmt yuv420p ${ranw}`, (err) => {
                            if (err) return reply('error')
                            botol.sendMessage(from, fs.readFileSync(ranw), video, {quoted:mek, mimetype: 'video/gif'})
                            fs.unlinkSync(ran)
                            fs.unlinkSync(ranw)
                        })
                    })
                } else {
                    reply('reply stickernya bang')
                }
                break
                case 's':
                case 'stiker':
                case 'sticker':
                case 'stickergif':
                case 'sgif':
                    if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
            						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
            						const media = await botol.downloadAndSaveMediaMessage(encmedia)
            						ran = getRandom('.webp')
            						await ffmpeg(`./${media}`)
            							.input(media)
            							.on('start', function (cmd) {
            								console.log(`Started : ${cmd}`)
            							})
            							.on('error', function (err) {
            								console.log(`Error : ${err}`)
            								fs.unlinkSync(media)
            								reply(mess.error.stick)
            							})
            							.on('end', function () {
            								console.log('Finish')
            								exec(`webpmux -set exif ${addMetadata(`${config.author}`, `${config.packname}`)} ${ran} -o ${ran}`, async (error) => {
            									if (error) return reply(mess.error.stick)
            									//await costum(fs.readFileSync(ran), sticker, FarhanGans, ` ~ Nihh Udah Jadi Stikernya`)
            									botol.sendMessage(from, fs.readFileSync(ran), MessageType.sticker, { quoted: mek })
            									fs.unlinkSync(media)
            									fs.unlinkSync(ran)
            								})
            							})
            							.addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
            							.toFormat('webp')
            							.save(ran)
                                                        } else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
            						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
            						const media = await botol.downloadAndSaveMediaMessage(encmedia)
            						ran = getRandom('.webp')
            						reply(mess.wait)
            						await ffmpeg(`./${media}`)
            							.inputFormat(media.split('.')[1])
            							.on('start', function (cmd) {
            								console.log(`Started : ${cmd}`)
            							})
            							.on('error', function (err) {
            								console.log(`Error : ${err}`)
            								fs.unlinkSync(media)
            								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
            								reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
            							})
            							.on('end', function () {
            								console.log('Finish')
            								exec(`webpmux -set exif ${addMetadata(`${config.author}`, `${config.packname}`)} ${ran} -o ${ran}`, async (error) => {
            									if (error) return reply(mess.error.stick)
            									//await costum(fs.readFileSync(ran), sticker, FarhanGans, `~ Nih Dah Jadi Gif Stikernya`)
            								botol.sendMessage(from, fs.readFileSync(ran), MessageType.sticker, { quoted: mek })
            									fs.unlinkSync(media)
            									fs.unlinkSync(ran)
            								})
            							})
              .addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
            							.toFormat('webp')
            							.save(ran)
                        } else {
                            reply('Tidak ada video/gif/gambar yang akan dijadikan stiker!')
                        }
                break
                case 'meme':
                    reply('Bentar om, lagi nyari...')
                    var { author, title, postLink, url } = await random()
                    var buffer = await getBuffer(url)
                    var options = {
                        caption: '-[ 𝙈𝙀𝙈𝙀𝙂𝙀𝙉 ]-',
                        contextInfo: {
                            participant: `${numbernya}@s.whatsapp.net`,
                            quotedMessage: {
                                extendedTextMessage: {
                                    text: `*Author: ${author}*\n*Title: ${title}*\n*Link: ${postLink}*`
                                }
                            }
                        }
                    }
                    botol.sendMessage(from, buffer, image, options)
                    break
                case 'memeimg':
                    case 'memeimage':
                            if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length > 0) {
                                const top = arg.split('|')[0]
                                const bottom = arg.split('|')[1]
                                const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace("quotedM","m")).message.extendedTextMessage.contextInfo : mek
                                const media = await botol.downloadMediaMessage(encmedia, 'buffer')
                                const getUrl = await uploadImages(media, false)
                                const memeRes = await custom(getUrl, top, bottom)
                                botol.sendMessage(from, memeRes, image, {quoted: mek, caption: 'dah jadi nih bang.'})
                            }
                            break
                case 'imgtourl':
                    if ((isMedia && !mek.videoMessage || isQuotedImage) && args.length == 0) {
                        reply('*Bentar...*')
                        const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace("quotedM","m")).message.extendedTextMessage.contextInfo : mek
                        const media = await botol.downloadMediaMessage(encmedia, 'buffer')
                        const getUrl = await uploadImages(media, false)
                        sendMess(from, `${getUrl}`)
                    }
                    break
                case 'wait':
                    case 'whatnimek':
                        if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
                            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace("quotedM","m")).message.extendedTextMessage.contextInfo : mek
                            const media = await botol.downloadMediaMessage(encmedia, 'buffer')
                            const img64 = `data:image/jpeg;base64,${media.toString('base64')}`
                            fetch('https://trace.moe/api/search', {
                                method: 'POST',
                                body: JSON.stringify({ image: img64 }),
                                headers: { "Content-Type": "application/json" }
                            })
                            .then(respon => respon.json())
                            .then(async (resolt) => {
                                if (resolt.docs && resolt.docs.length <= 0) {
                                    reply('Gak tau anime apaan!')
                                }
                                const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                                var teksnime = ''
                                if (similarity < 0.92) {
                                    teksnime += '*Saya memiliki keyakinan rendah dengan request ini*\n\n'
                                }
                                teksnime += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`
                                teksnime += `➸ *Ecchi* : ${is_adult}\n`
                                teksnime += `➸ *Eps* : ${episode.toString()}\n`
                                teksnime += `➸ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                                var imek = `https://media.trace.moe/image/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`
                                var buffer = await getBuffer(imek)
                                
                                botol.sendMessage(from, buffer, image, { quoted: mek, caption: teksnime })
                            })
                            .catch(err => console.log('[',color('!', 'red'),']', color(err, 'red')))
                        }
                        break
                case 'tga':
                    members_id = []
                    teks = args.join(" ")
                    teks += "\n\n"
                    for (let mem of groupMembers) {
                        teks += `• @${mem.jid.split("@")[0]}\n`
                        members_id.push(mem.jid)
                    }
                    mentions(teks, members_id)
                    break
                case 'tga2':
                    members_id = []
                    teks = "*Tagall v2*"
                    teks += "\n\n"
                    for (let mem of groupMembers) {
                        teks += `~> @${mem.jid.split("@")[0]}\n`
                        members_id.push(mem.jid)
                    }
                    botol.sendMessage(from, teks, text, {quoted:mek, contextInfo: { "mentionedJid": members_id}})
                    break
                case 'tga3':
                    members_id = []
                    teks = "*Tagall v3*"
                    teks += "\n\n"
                    for (let mem of groupMembers) {
                        teks += `<#> https://wa.me/${mem.jid.split("@")[0]}\n`
                        members_id.push(mem.jid)
                    }
                    botol.sendMessage(from, teks, text, {contextInfo: {"mentionedJid": members_id }})
                    break
                case 'setnick':
                    entah = args.join(" ")
                    botol.updateProfileName(entah).then(() => {
                        reply(`Sukses mengubah ke ${entah}`)
                    }).catch((err) => { reply(`Error: ${err}`) })
                    break
                case 'setpict':
                    if ((isMedia && !mek.message.videoMessage || isQuotedImage)) {
                        const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                        const media = await botol.downloadMediaMessage(encmedia, 'buffer')
                        botol.updateProfilePicture(botNumber, media).then(() => {
                            reply('Sukses update profile picture')
                        }).catch((err) => {
                            reply(`Error: ${err}`)
                        })
                    } else {
                        reply('bukan gambar')
                    }
                    break
                case 'del':
                    case 'delete':
                        if (args[0] === 'priv' || args[0] === 'private') {
                            memew = botol.chats.array.filter(v => v.jid.endsWith("@s.whatsapp.net") || v.jid.endsWith("@c.us")).map(v => v.jid)
                            for (let ids of memew) botol.modifyChat(ids, 'delete')
                            reply(`Sukses menghapus *${memew.length}* personal chat`)
                        } else {
                            reply("*Masukan type chat yang ingin dibersihkan*\n1. private -> Personal Chat")
                        }
                        break
                case 'hilih':
                    entah = args.join(" ")
                    imni = hilih(entah)
                    reply(imni)
                    break
                case 'kontag':
                    entah = args[0]
                    var kontag = `*${entah}*`
                    if (entah === '') {
                    var kontag = '*KONTAK HIDETAG*'
                    }
                    members_ids = []
                    for (let mem of groupMembers) {
                        members_ids.push(mem.jid)
                    }
                    vcard = 'BEGIN:VCARD\n'
                              + 'VERSION:3.0\n'
                              + `FN:${kontag}\n`
                              + `TEL;type=CELL;type=VOICE;waid=${botol.user.jid.split('@')[0]}:${phoneNum('+' + botol.user.jid('@')[0]).getNumber('internasional')}\n`
                              + 'END:VCARD'.trim()
                        botol.sendMessage(from, {displayName: 'Kontag', vcard: vcard}, contact, {contextInfo: {"mentionedJid": members_ids}})
                        break
                case 'kontak':
                    entah = args[0]
                    disname = args[1]
                    if (isNaN(entah)) return reply('Invalid phone number'.toUpperCase());
                    vcard = 'BEGIN:VCARD\n'
                              + 'VERSION:3.0\n'
                              + `FN:${disname}\n`
                              + `TEL;type=CELL;type=VOICE;waid=${entah}:${phoneNum('+' + entah).getNumber('internasional')}\n`
                              + 'END:VCARD'.trim()
                        botol.sendMessage(from, {displayName: disname, vcard: vcard}, contact)
                        break
                case 'tr':
                        if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) {
                            tolang = args[0]
                            entah = body.slice(3+args[0].length+1)
                            translate(entah, tolang)
                            .then((res) => { reply(`${res}`) })
                        } else {
                            tolang = args[0]
                            entah = mek.message.extendedTextMessage.contextInfo.quotedMessage.conversation
                            translate(entah, tolang)
                            .then((res) => { reply(`${res}`) })
                        }
                        break
                case 'tomp3':
                    if ((isMedia && mek.message.videoMessage.seconds <= 30 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds <= 30)) {
                        const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                        const media = await botol.downloadAndSaveMediaMessage(encmedia, "video")
                        exec(`ffmpeg -y -i ${media} -b:a 192K -ar 44100 -vn -f mp3 tomp3.mp3`, function(err) {
                            fs.unlinkSync(media)
                            if (err) return reply("error om")
                            botol.sendMessage(from, fs.readFileSync('./tomp3.mp3'), audio, {mimetype: 'audio/ogg', quoted: mek})
                            fs.unlinkSync('./tomp3.mp3')
                        })
                    }
                    break
                  case 'trigger':
					var imgbb = require('imgbb-uploader')
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						ger = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
						reply(mess.wait)
						owgi = await botol.downloadAndSaveMediaMessage(ger)
						anu = await imgbb("3b8594f4cb11895f4084291bc655e510", owgi)
						ranp = getRandom('.gif')
						rano = getRandom('.webp')
						anu1 = await fetchJson(`http://zekais-api.herokuapp.com/trigger?url=${anu.display_url}`)
						exec(`wget ${anu1.result.image} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=12 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
							fs.unlinkSync(ranp)
							exec(`webpmux -set exif ${addMetadata(`${config.author}`, `${config.packname}`)} ${rano} -o ${rano}`, async (error) => {
								if (error) return reply(`Error: ${error}`)
								botol.sendMessage(from, fs.readFileSync(rano), sticker, { quoted: mek })
								fs.unlinkSync(rano)
							})
						})
					} else {
						reply(mess.wrongFormat)
					}
					break
				case 'wasted':
					var imgbb = require('imgbb-uploader')
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						ger = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
						owgi = await botol.downloadAndSaveMediaMessage(ger)
						anu = await imgbb("3b8594f4cb11895f4084291bc655e510", owgi)
						teks = `${anu.display_url}`
						ranp = getRandom('.gif')
						rano = getRandom('.webp')
						anu2 = `https://some-random-api.ml/canvas/wasted?avatar=${teks}`
						exec(`wget ${anu2} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
							fs.unlinkSync(ranp)
							if (err) return reply(`Error: ${err}`)
							exec(`webpmux -set exif ${addMetadata(`${config.author}`, `${config.packname}`)} ${rano} -o ${rano}`, async (error) => {
								if (error) return fakegroup(`Error: ${error}`)
								botol.sendMessage(from, fs.readFileSync(rano), sticker, { quoted: mek })
								fs.unlinkSync(rano)
							})
						})
					} else {
						reply('Gunakan foto!')
					}
					break
                                case 'thuglife':
        					var imgbb = require('imgbb-uploader')
        					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
        						ger = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
        						owgi = await botol.downloadAndSaveMediaMessage(ger)
        						anu = await imgbb("3b8594f4cb11895f4084291bc655e510", owgi)
        						teks = `${anu.display_url}`
        						ranp = getRandom('.gif')
        						rano = getRandom('.webp')
        						anu2 = `http://zekais-api.herokuapp.com/thuglife?url=${teks}`
        						exec(`wget ${anu2} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
        							fs.unlinkSync(ranp)
        							if (err) return reply(`Error: ${err}`)
        							exec(`webpmux -set exif ${addMetadata(`${config.author}`, `${config.packname}`)} ${rano} -o ${rano}`, async (error) => {
        								if (error) return reply(`Error: ${error}`)
        								botol.sendMessage(from, fs.readFileSync(rano), sticker, { quoted: mek })
        								fs.unlinkSync(rano)
        							})
        						})
        					} else {
        						reply('Gunakan foto!')
        					}
        					break
        				case 'tobecontinue':
        					var imgbb = require('imgbb-uploader')
        					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
        						ger = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
        						owgi = await botol.downloadAndSaveMediaMessage(ger)
        						anu = await imgbb("3b8594f4cb11895f4084291bc655e510", owgi)
        						teks = `${anu.display_url}`
        						ranp = getRandom('.gif')
        						rano = getRandom('.webp')
        						anu2 = `http://zekais-api.herokuapp.com/tobecontinue?url=${teks}`
        						exec(`wget ${anu2} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
        							fs.unlinkSync(ranp)
        							if (err) return reply(`Error: ${err}`)
        							exec(`webpmux -set exif ${addMetadata(`${config.author}`, `${config.packname}`)} ${rano} -o ${rano}`, async (error) => {
        								if (error) return reply(`Error: ${error}`)
        								botol.sendMessage(from, fs.readFileSync(rano), sticker, { quoted: mek })
        								fs.unlinkSync(rano)
        							})
        						})
        					} else {
        						reply('Gunakan foto!')
        					}
        					break
        				case 'ppcouple':
        					anu = await fetchJson('https://lindow-api.herokuapp.com/api/ppcouple?apikey=megacantik')
        					cwok = await getBuffer(anu.result.male)
        					botol.sendMessage(from, cwok, MessageType.image, { caption: 'Cowok', quoted: mek })
        					cwek = await getBuffer(anu.result.female)
        					botol.sendMessage(from, cwek, MessageType.image, { caption: 'Cewek', quoted: mek })
        					break
				default:
			}
			if (isGroup && budy != undefined) {
			} else {
				console.log(color('[Botol-Bot]', 'green'), 'Any Message ? ', color(sender.split('@')[0]))
			}
	} catch (e) {
		console.log('Message : %s', color(e, 'green'))
		// console.log(e)
	}
})
}
starts()