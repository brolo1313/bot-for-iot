const { IoT_URL, IoT_PORT } = process.env;

export async function sendCommandToIot(command) {
  const url = `http://${IoT_URL}:${IoT_PORT}/${command}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("🚨 Помилка запиту до ESP!", err);

    const causeMessage = err.cause
      ? `\n\nПричина: ${err.cause.name}: ${err.cause.message}`
      : "";

    return {
      status: "error",
      message: `🚨 *Помилка* запиту до ESP!\n\n${err.name}: ${err.message}${causeMessage}`,
    };
  }
}
