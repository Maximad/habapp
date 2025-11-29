async function handleInteraction(interaction, handler) {
  try {
    await handler(interaction);
    console.log(
      `[HabApp][interaction] /${interaction.commandName} by ${interaction.user?.id || 'unknown'} -> ok`
    );
  } catch (err) {
    console.error('[HabApp][interaction] Command failed', {
      command: interaction.commandName,
      user: interaction.user?.id,
      error: err
    });

    if (interaction?.isRepliable && !interaction.isRepliable()) return;
    if (interaction?.replied || interaction?.deferred) {
      try {
        await interaction.editReply(
          'حدث خطأ غير متوقع أثناء تنفيذ الأمر. \nإذا استمر الخطأ، أخبر فريق HabApp مع تفاصيل الأمر.'
        );
      } catch (replyErr) {
        console.error('[HabApp][interaction] Failed to send error reply', replyErr);
      }
      return;
    }

    try {
      await interaction.reply({
        content:
          'حدث خطأ غير متوقع أثناء تنفيذ الأمر. \nإذا استمر الخطأ، أخبر فريق HabApp مع تفاصيل الأمر.',
        ephemeral: true
      });
    } catch (replyErr) {
      console.error('[HabApp][interaction] Failed to send error reply', replyErr);
    }
  }
}

module.exports = { handleInteraction };
