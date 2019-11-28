const Discord = require('discord.js');

exports.run = async(bot, message, args, ops) => {
    message.delete()
    let embed = new Discord.RichEmbed()
    .setColor("2e007c")
    .setAuthor(`STCommunity diz:`, bot.user.avatarURL)
    .setDescription("Verifique sua DM!! :point_up_2: ")
    .setFooter(message.author.username, message.author.avatarURL)
    .setTimestamp()
    .setThumbnail(bot.user.avatarURL)
    message.channel.send(embed)
    
    let dmembed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`STCommunity diz:`, bot.user.avatarURL)
    .setDescription("Lista de comandos:\n\n  :small_red_triangle: !help (Lista de comandos) \n :small_red_triangle: !perfil (Verifica o perfil de um usuário)")
    .setFooter(message.author.username, message.author.avatarURL)
    .setTimestamp()
    .setThumbnail(bot.user.avatarURL)
    message.author.send(dmembed)
}

module.exports.config = {
    name: "help",
    aliases: ["ajuda"]
}