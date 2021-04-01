const {
    WAConnection,
    Mimetype,
    Presence,
    MessageType,
    GroupSettingChange,
    waMessageKey,
    Browsers
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { color, processTime, sleep, getGroupAdmins, getRandom, hilih } = require('./utils/index')
const { fetchJson, getBuffer, fetchText, uploadImages } = require('./utils/fetcher')
const { custom, random } = require('./utils/meme')
const { exec, spawn } = require('child_process')
const translate = require('./utils/translate')
const moment = require('moment-timezone')
const ffmpeg = require('fluent-ffmpeg')
const fetch = require('node-fetch')
const figlet = require('figlet')
const lolcatjs = require('lolcatjs')
const phoneNum = require('awesome-phonenumber')
const { menuId } = require('./teks')
const { exif } = require('./lib/exif')

/***************D A T A B A S E****************/
const config = JSON.parse(fs.readFileSync('./config.json'))

prefix = '.'
fake = 'Botol Bot'
numbernya = '0'
let gambar64 = "" || fs.readFileSync('./media/images/9739.png')

function kyun(seconds){
    function pad(s){
      return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60*60));
    var minutes = Math.floor(seconds % (60*60) / 60);
    var seconds = Math.floor(seconds % 60);
  
    //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
    return `• Runtime\n${pad(hours)}H ${pad(minutes)}M ${pad(seconds)}S`
}

function addMetadata(packname, author) {
	if (!packname) packname = `${config.packname}`; if (!author) author = ` ${config.author}`;
	author = author.replace(/[^a-zA-Z0-9]/g, '');
	let name = `${author}_${packname}`

	if (fs.existsSync(`./src/sticker/${name}.exif`)) {
		return `./src/sticker/${name}.exif`
	}
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

async function starts() {
    const botol = new WAConnection()

    botol.logger.level = 'warn'
    botol.browserDescription=Browsers.ubuntu("Chrome")

    botol.on('qr', () => {
        console.log('[', color('!', 'red') ,']', 'Please, scan the QR code!')
    })

    fs.existsSync('./session.json') && botol.loadAuthInfo('./session.json')
    botol.on('connecting', () => {
        console.log(color('Connecting to WhatsApp...', 'green'))
    })
    botol.on('open', () => {
        console.log(color('Connected', 'green'))
        lolcatjs.fromString(figlet.textSync('Welcome', 'Larry 3D'))
    })
    await botol.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./session.json', JSON.stringify(botol.base64EncodedAuthInfo(), null, '\t'))

    botol.on('chat-update', async (mek) => {
        try {
            if (!mek.hasNewMessage) return
            mek = mek.messages.all()[0]
        			if (!mek.message) return
        			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
        			if (mek.key.fromMe) return //untuk self
            const content = JSON.stringify(mek.message)
            const from = mek.key.remoteJid
            const type = Object.keys(mek.message)[0]
            const { text, extendedText, liveLocation, contact, contactsArray, location, image, video, sticker, document, audio, product } = MessageType
            const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
            body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
            budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const arg = body.substring(body.indexOf(' ') + 1)
            const args = body.trim().split(/ +/).slice(1)
            const isCmd = body.startsWith(prefix)

            const botNumber = botol.user.jid
            const ownerNumber = ["628xxxxxxxxxxx@s.whatsapp.net"] // Replace with your number
            const isGroup = from.endsWith('@g.us')
            const sender = isGroup ? mek.participant : mek.key.remoteJid
            const sender1 = sender === undefined ? botNumber : sender
            const groupMetadata = isGroup ? await botol.groupMetadata(from) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
            const isGroupAdmins = groupAdmins.includes(sender) || false
            const isOwner = ownerNumber.includes(sender)
            pushname2 = botol.contacts[sender1] != undefined ? botol.contacts[sender1].vname || botol.contacts[sender1].notify : undefined
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				botol.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				botol.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? botol.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : botol.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
            }

            const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
            const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
            if (!isGroup && !isCmd) console.log(color(`[${time}]`, 'yellow'), color("[ PRIVATE ]", "aqua"), 'message from', color(sender1.split("@")[0]))
            if (isGroup && !isCmd) console.log(color(`[${time}]`, 'yellow'), color('[ GROUP ]', 'aqua'), 'message from', color(sender1.split("@")[0]), 'in', color(groupName))
            if (!mek.key.fromMe && isGroup && isCmd) console.log(color(`[${time}]`, 'yellow'), color('[ GROUP ]', 'aqua'), 'message from', color(sender1.split("@")[0]), 'in', color(groupName))
            if (isGroup && isCmd) console.log(color(`[${time}]`, 'yellow'), color('[ EXEC ]'), 'from', color(sender1.split("@")[0]), 'in', color(groupName))
            if (!isGroup && isCmd) console.log(color(`[${time}]`, 'yellow'), color("[ EXEC ]"), 'from', color(sender1.split("@")[0]))
            
                switch(command) {
                    case 'ping':
                        case 'speed':
                            reply(`Pong, *${processTime(mek.messageTimestamp, moment())} _Seconds_*`)
                            break
                    case 'help': 
                    case 'menu': {
                        const teks = {
                            text: menuId.Help(prefix),
                            contextInfo: {
                                participant: `0@s.whatsapp.net`,
                                remoteJid: "status@broadcast",
                                quotedMessage: {
                                    productMessage: {
                                        product: {
                                            currencyCode: "USD",
                                            description: fake,
                                            title: fake,
                                            priceAmount1000: "999999999",
                                            productImageCount: 1,
                                            productImage: {
                                                mimetype: "image/png",
                                                jpegThumbnail: gambar64
                                            }
                                        },
                                        businessOwnerJid: "0@s.whatsapp.net"
                                    }
                                }
                            }
                        }
                        botol.sendMessage(from, teks, text)
                    }
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
            						const media = await angga.downloadAndSaveMediaMessage(encmedia)
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
            									angga.sendMessage(from, fs.readFileSync(ran), MessageType.sticker, { quoted: mek })
            									fs.unlinkSync(media)
            									fs.unlinkSync(ran)
            								})
            							})
            							.addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
            							.toFormat('webp')
            							.save(ran)
            } else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
            						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
            						const media = await angga.downloadAndSaveMediaMessage(encmedia)
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
            								angga.sendMessage(from, fs.readFileSync(ran), MessageType.sticker, { quoted: mek })
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
                    if (isNaN(entah)) return reply('Invalid phone number');
                    members_ids = []
                    for (let mem of groupMembers) {
                        members_ids.push(mem.jid)
                    }
                    vcard = 'BEGIN:VCARD\n'
                              + 'VERSION:3.0\n'
                              + 'FN:Kontag Boss\n'
                              + `TEL;type=CELL;type=VOICE;waid=${entah}:${phoneNum('+' + entah).getNumber('internasional')}\n`
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
        } catch(err) {
            console.log('[',color('!', 'red'),']', color(err, 'red'))
        }
    })
}

starts()
