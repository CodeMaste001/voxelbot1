const fs = require('fs');
const path = require('path');
const permissionsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/permissions.json'), 'utf8'));

function hasCommandPermission(member, commandName) {
  const perms = permissionsConfig[commandName] || [];
  if (perms.length === 0) return true;

  // Admin Override
  if (member.permissions.has('Administrator')) return true;

  for (const perm of perms) {
    if (member.roles.cache.some(role => role.name === perm)) return true;
  }
  return false;
}

function logDeniedAttempt({ user, command, reason }, client) {
  const logMsg = `[${new Date().toISOString()}] Usuario ${user.tag} (${user.id}) intentó usar /${command} sin permisos: ${reason}\n`;
  // Guardar en archivo local
  fs.appendFileSync(path.join(__dirname, '../../denied.log'), logMsg);
  // Enviar a canal privado si existe
  const adminLogChannelId = process.env.ADMIN_LOG_CHANNEL;
  if (client && adminLogChannelId) {
    const channel = client.channels.cache.get(adminLogChannelId);
    if (channel && channel.isTextBased()) {
      channel.send({ embeds: [{ color: 0xff0000, title: 'Intento de comando denegado', description: logMsg }] });
    }
  }
}

module.exports = { hasCommandPermission, logDeniedAttempt };
