async function handleInteraction(interaction, handler) {
  try {
    await handler(interaction);
    console.log(
      `[HabApp][interaction] /${interaction.commandName} by ${
        interaction.user?.id || 'unknown'
      } -> ok`
    );
  } catch (err) {
    console.error('[HabApp][interaction] Command failed', {
      command: interaction.commandName,
      user: interaction.user?.id,
      error: err
    });

    // If Discord already considers this interaction "unknown", don't fight it.
    // This happens with stale tokens or very old / double-used interactions.
    if (err.code === 10062) {
      console.warn(
        '[HabApp][interaction] Skipping error reply due to Unknown interaction (10062)'
      );
      return;
    }

    // If the interaction is not repliable, just give up gracefully
    if (interaction?.isRepliable && !interaction.isRepliable()) return;

    // If we already replied or deferred, try editing the reply
    if (interaction?.replied || interaction?.deferred) {
      try {
        await interaction.editReply(
          'حدث خطأ غير متوقع أثناء تنفيذ الأمر. \nإذا استمر الخطأ، أخبر فريق HabApp مع تفاصيل الأمر.'
        );
      } catch (replyErr) {
        if (replyErr?.code === 10062) {
          console.warn(
            '[HabApp][interaction] Skipping error reply due to Unknown interaction (10062)'
          );
          return;
        }
        console.error('[HabApp][interaction] Failed to send error reply', replyErr);
      }
      return;
    }

    // Otherwise, send a fresh reply (ephemeral via flags to avoid deprecation warning)
    try {
      await interaction.reply({
        content:
          'حدث خطأ غير متوقع أثناء تنفيذ الأمر. \nإذا استمر الخطأ، أخبر فريق HabApp مع تفاصيل الأمر.',
        flags: 64 // EPHEMERAL
      });
    } catch (replyErr) {
      if (replyErr?.code === 10062) {
        console.warn(
          '[HabApp][interaction] Skipping error reply due to Unknown interaction (10062)'
        );
        return;
      }
      console.error('[HabApp][interaction] Failed to send error reply', replyErr);
    }
  }
}

module.exports = { handleInteraction };
