/*
**** Constantes
*/

const Discord = require("discord.js"); //Aqui definimos a discord.js em nosso código, caso dê erro nessa linha, só dê npm i discord.js no console ;v
const bot     = new Discord.Client() // Aqui definimos o bot ( bot )
const config  = require("./config.js"); //Aqui definimos o config.js em nosso código, ele vai servir pro bot logar e sabermos o prefix do bot sem definir algo novamente, caso dê erro nessa linha, cheque o arquivo config.js, digitação dessa linha e se o arquivo config.js e a pasta utils existem :v
const fs      = require("fs") //Aqui definimos o fs em nosso código, ele vai servir pro nosso Handler, caso dê erro nessa linha, só dê npm i fs no console ;v
var database = require("./database.js"); // MongoDB
const mysql   = require("mysql"); // MySQL

bot.commands  = new Discord.Collection();
bot.aliases   = new Discord.Collection();

/*
**** Handler
*/

fs.readdir("./comandos/", (err, files)=> { //pedimos para o fs ler a pasta comandos
    if(err) return console.log(`Houve um erro:\n${err}`); //se tiver um erro, ele não executará o que estiver abaixo e irá retornar com um log no console
    let jsfile = files.filter(f => f.split(".").pop() === "js") //aqui a gente define files para diferenciar os arquivos com .js dos sem .js
    if(jsfile.length <= 0) {
        return console.log('Não encontrei nenhum comando.')
    };
    jsfile.forEach((f, i) => { //aqui dizemos que para cada arquivo com .js na pasta, iremos fazer a seguinte coisa:
        let pull = require(`./comandos/${f}`); //iremos definir comando
        bot.commands.set(pull.config.name, pull); //iremos setar o nome do comando/local na collection comandos
        console.log(`[Carregando] > ${f}`); //aqui colocamos para que o bot envie os comandos carregados para o console
        pull.config.aliases.forEach(alias => { //aqui dizemos que para cada aliases do comand
            bot.aliases.set(alias, pull.config.name) //setar a aliases/nome do comando na collection aliases
        });
    });
});

/*
**** Primeiro Evento
*/

let status = [
    {name: `Stranger Things!`, type: `WATCHING`},
    {name: `Fui desenvolvido pelo Panda`, type: "STREAMING", url: "https://www.twitch.tv/zpandakst_"},
    {name: ` D&D!`, type: `PLAYING`},
   //{name: 'msg4', type: 'STREAMING', url: 'https://www.twitch.tv/hinami_fueguchi_'}, 
   
  ];
  
  //STREAMING = TRANSMITINDO
  //LISTENING = OUVINDO
  //PLAYING = JOGANDO
  //WATCHING = ASSISTINDO
  
  
  bot.on('ready', () => {
    var embed = new Discord.RichEmbed()
    .setTitle(`:pushpin: | Iniciando...`)
    .setDescription(`:white_small_square: | MillieBot **Iniciado** \n \n Dados: \n ▸ Usuários: ${bot.users.size} \n ▸ Canais: ${bot.channels.size}`)
    .setThumbnail(bot.user.avatarURL)
    .setTimestamp()
    bot.guilds.get(`646833634824814602`).channels.get(`646873986453733396`).send(embed)
  
    function setStatus() {
        let randomStatus = status[Math.floor(Math.random() * status.length)];
        bot.user.setPresence({game: randomStatus});
    }
  
    setStatus();
    setInterval(() => setStatus(), 7000); //{1000/1s}\{10000/10s}\{100000/1m}
  });


bot.on("ready", () => {
    console.log('Estou online.')
    /*
    * PLAYING = Jogando. Exemplo - bot.user.setActivity('oi', {type: 'PLAYING'});
    * WATCHING = Assistindo. Exemplo - bot.user.setActivity('oi', {type: 'WATCHING'});
    * LISTENING = Ouvindo. Exemplo - bot.user.setActivity('oi', {type: 'LISTENING'});
    * STREAMING = Transmitindo. Exemplo - bot.user.setActivity('oi', {type: 'STREAMING', url: 'twitch'});
    */
});

/*
**** CONNECTOR
*/

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Tornado135",
    insecureAuth : true
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("[MySQL/Online] > Conectado à DataBase!");
  });

/*
**** Evento Message
*/

var cmdCol = new Set();
 
bot.on("guildMemberAdd", (member) => {

    var role = member.guild.roles.find('name', 'Guest 🎈');
    member.addRole(role)
})

bot.on("guildMemberAdd", (member) => {
    var embedJoin = new Discord.RichEmbed()
        .setColor("24ff00")
        .setTitle("STCommunity - Entrada", bot.user.avatarURL)
        .setDescription(`${member.user.tag} acabou de entrar para a STCommunity!`)
        .setFooter(`Sejá bem-vindo :)`)
        .setThumbnail(member.user.displayAvatarURL)
        .setTimestamp()
        bot.guilds.get(`646833634824814602`).channels.get(`646833635336388631`).send(embedJoin)
    })

bot.on('guildMemberRemove', member =>{
    var embedLeave = new Discord.RichEmbed()
    .setColor("ff0000")
    .setAuthor(`STCommunity - Saida`, bot.user.avatarURL)
    .setDescription(`O usuário ${member.user.tag} acabou de sair da STCommunity`)
    .setFooter(`Adeus... Volte sempre :)`)
    .setTimestamp()
    .setThumbnail(bot.user.avatarURL)
    bot.guilds.get(`646833634824814602`).channels.get(`646875919327297546`).send(embedLeave)
    })

bot.on('message', async(message) => { // Sempre que ocorrer uma mensagem, esse evento é executado ;v
    if(message.author.bot) return; //Se o author da mensagem, ou seja, quem mandou a mensagem, for um bot, ele não executará o código
    if(message.channel.type === 'dm') return; //Se o canal que a mensagem foi mandada for na DM ( Direct Messages, ou seja, as mensagens privadas ), ele não executará o código

    if(message.content.includes('<@'+bot.user.id+'>')){
        database.Guilds.findOne({
            _id: message.guild.id
        }, function(servro, servidor) {
            if(servidor) {
                var prefixo
                prefixo = servidor.prefix
                
                message.channel.send(`:mushroom: **${message.author.username}**, meu prefixo neste servidor é: \`${prefixo}\``);

            } else if(!servidor) {
                var save = new database.Guilds({
                    _id: message.guild.id
                })
                save.save()
            }
        })
    }

    database.Guilds.findOne({
        _id: message.guild.id
    }, function(err, servidor) {
        database.Users.findOne({
            _id: message.author.id
        }, function(erro, usuario) {
            if (usuario) {
                if (servidor) {
                    let prefixo
                    prefixo = servidor.prefix
        
                    if(message.content.indexOf(prefixo) !== 0) return; //Se a mensagem não começar com o prefix, ele não executará o código
                
                    let args = message.content.slice(prefixo.length).trim().split(/ +/g); // Aqui definimos args
                    let command = args.shift().toLowerCase(); // Definição de comando
                    let ma = message.content.split(' ');
                    let cmd = ma[0];
                    
                    let commandFile = bot.commands.get(cmd.slice(prefixo.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefixo.length))) // Aqui definimos "cmd" para buscar os comandos na collection
                    if(commandFile) {
                        let canal = bot.guilds.get('646833634824814602').channels.get('646876084394131457');
                        canal.send(`:white_check_mark: O comando [` + '``' + `${command}` + '``' + `] foi utilizado corretamente no canal ${'[``'+message.channel.name+'``]'} ${'(``'+message.channel.id+'``)'} por ${message.author.tag}${'(``'+message.author.id+'``)'}.`)
                        if(!usuario.ban || usuario.isOwner) {
                            if(!cmdCol.has(message.author.id)) {
                                database.Comandos.findOne({
                                    _id: command
                                }, function(erro, comando) {
                                    if(comando) {
                                        if(comando.manutenção && !usuario.owner) {
                                            message.channel.send(`:x: || **${message.author.username}**, este comando está em manutenção.`)
                                            cooldownCMD()        
                                        } else {            
                                            commandFile.run(bot, message, args, prefixo, command)
            
                                            var num = comando.usos
                                            num = num+1                    
                                            comando.usos = num
                                            comando.save() 
                                            cooldownCMD()
                                        }
                                    
                                    } else {
                                        var comandoC = new database.Comandos({
                                            _id: command,
                                            usos: 0,
                                            manutenção: false,
                                            lastError: "Nenhum"
                                        })
                                        comandoC.save()                            
                                        message.channel.send(`:white_check_mark: **${message.author.username}**, este comando foi registrado em meu banco de dados. Use o comando novamente.`)
                                    } 
                                })
                            } else {
                                message.channel.send(`:mushroom: || **${message.author.username}**, espere um **pouco** antes de executar outro **comando**.`)                                    
                            }
                        } else {
                            let canallog = bot.guilds.get('646833634824814602').channels.get(`XXX`)
                            canallog.send(`<:dislike_space:575134386698321921> O usuário **${message.author.username}** tentou executar um comando, mas estava banido! :confused:`)
                            message.channel.send(`:x: **${message.author.username}**, você está **banido** de usar meus **comandos**.`)
                        }
                
                    } else if(!commandFile) {
                        let channellog = bot.guilds.get('646833634824814602').channels.get('646876084394131457')
                        channellog.send(`:x: O comando [` + '``' + `${command}` + '``' + `] foi utilizado incorretamente no servidor ${'[``'+message.guild.name+'``]'}${'(``'+message.guild.id+'``)'} no canal ${'[``'+message.channel.name+'``]'} ${'(``'+message.channel.id+'``)'} por ${message.author.tag}${'(``'+message.author.id+'``)'}.`)
                    }
                } else if(!servidor) {
                    var saveG = new database.Guilds({
                        _id: message.guild.id
                    })
                    saveG.save()
                }                
            } else if(!usuario) {
                var saveU = new database.Users({_id: message.author.id})
                saveU.save()                
            }
        })
    })

    async function cooldownCMD() {
        cmdCol.add(message.author.id)
        setTimeout(function() {
            cmdCol.delete(message.author.id)
        }, 3000)
    };

    database.Guilds.findOne({
        '_id': message.guild.id
    }, function(serverro, servidor) {
        if (servidor) {
            if (servidor.invites || servidor.links) {
                if (message.guild.me.hasPermission("MANAGE_MESSAGES")) {
                    if (message.member.hasPermission(['MANAGE_MESSAGES'])) {} else {
                        let mensagem = message.content.split(' ')
    
                        try {
                            if (servidor.links) {
                                if (message.content.toLowerCase().includes('http://') || message.content.toLowerCase().includes('https://') || message.content.toLowerCase().includes('www') || message.content.toLowerCase().includes('.com') ||message.content.toLowerCase().includes('.br')) {
                                    message.delete()
                                    message.channel.send(`:x: **${message.author.username}**, proibido o envio de links aqui.`)
                                }
                            }
                            if (servidor.invites) {
                                if (message.content.toLowerCase().includes('discord.gg/') || message.content.toLowerCase().includes('discordapp.com/invite') || message.content.toLowerCase().includes('discord.me/')) {
                                    message.delete()
                                    message.channel.send(`:x: **${message.author.username}**, proibido o envio de convites aqui.`)
                                }
                            }
                        } catch (e) {
                            console.error(e)
                        }
                    }                
                } else {
                    message.channel.send(`:x: **${message.author.username}**, Ocorreu um erro!\n<:config_space:552966784194576394> Não ternho permissão para excluir mensagens no servidor.`)
                }
            } else {}
        } else {}
    })
    
});

//Login

bot.login(config.token)


/*


  

*/