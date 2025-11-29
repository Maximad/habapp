async function handleInteraction(interaction, handler) {
  try {
    await handler(interaction);
    console.log(
      `[HabApp] Command /${interaction.commandName} by ${interaction.user?.id || 'unknown'} -> ok`
    );
  } catch (err) {
    console.error('[HabApp] Command failed', {
      command: interaction.commandName,
      user: interaction.user?.id,
      error: err
    });
    if (!interaction.replied && !interaction.deferred) {
      try {
        await interaction.reply({
          content: 'صار خطأ غير متوقع أثناء تنفيذ الأمر. إذا استمر الخطأ، تواصل/ي مع فريق الإدارة.',
          ephemeral: true
        });
      } catch (replyErr) {
        console.error('[HabApp] Failed to send error reply', replyErr);
      }
    }
  }
}

module.exports = { handleInteraction };
