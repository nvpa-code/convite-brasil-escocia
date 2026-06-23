const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/Kb65AtlxZhr26HFXvRoadC';

const FINAL_EMOJIS = ['⚽', '🥩', '🍺'];

export function FinalScreen() {
  return (
    <section className="final-screen" aria-label="Presença confirmada">
      <div className="final-copy">
        <p className="eyebrow">Brasil x Escócia</p>
        <h2>Presença confirmada!</h2>
        <p>Traga sua bebida alcoólica e muita felicidade!</p>
      </div>

      <div className="final-emojis" aria-hidden="true">
        {FINAL_EMOJIS.map((emoji, index) => (
          <span key={`${emoji}-${index}`}>{emoji}</span>
        ))}
      </div>

      <a className="whatsapp-button" href={WHATSAPP_GROUP_URL} target="_blank" rel="noreferrer">
        Entrar no grupo do WhatsApp
      </a>
    </section>
  );
}
