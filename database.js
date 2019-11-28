const { connect, Schema, model } = require('mongoose');
let url = 'mongodb+srv://NUMPODI:NUMPODI@NUMPODI-v0jnh.gcp.mongodb.net/test?retryWrites=true&w=majority'

connect(url, { useNewUrlParser: true }, (err) => {
    if (err) return console.log('[DataBase/Error] > Erro ao tentar conectar à DB.')
    console.log('[DataBase/Online] > Conectado à DB!')
});

var User = new Schema({
    _id: {
        type: String
    },
    isCeo: {
        type: Boolean,
        default: false
    },
    isMillieL: {
        type: Boolean,
        default: false
    },
    isMikeL: {
        type: Boolean,
        default: false
    },
    isModerator: {
        type: Boolean,
        default: false
    },
    coins: {
        type: String,
        default: 0
    },
    ban: {
        type: Boolean,
        default: false
    },
    timedaily: {
        type: String,
        default: '0000000000000'
    }
});

var Guild = new Schema({
    _id: {
        type: String
    },
    prefix: {
        type: String,
        default: "!"
    },
    autorole: {
        type: Boolean,
        default: false
    },
    autoroleid: {
        type: String,
        dafault: 'Guest 🎈'
    },
    muterole: {
        type: Boolean,
        default: false
    },
    muteroleid: {
        type: String,
        default: "Sem cargo definido!"
    },
    links: {
        type: Boolean,
        default: false
    },
    invites: {
        type: Boolean,
        default: false
    }
});

var Comando = new Schema({
    _id: {
      type: String
    },
    usos: {
      type: Number,
      default: 0
    },
    autorole: {
        type: Boolean,
        default: false
    },
    autoroleid: {
        type: String,
        default: 'Nenhum'
    }
}); 

exports.Users = model('Users', User)
exports.Guilds = model('Guilds', Guild)
exports.Comandos = model('Comandos', Comando)
