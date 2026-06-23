import { useRef } from 'react';
import { RunawayButton } from './RunawayButton';

type InviteCardProps = {
  isLeaving: boolean;
  onConfirm: () => void;
};

export function InviteCard({ isLeaving, onConfirm }: InviteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <section
      ref={cardRef}
      className={`invite-card ${isLeaving ? 'invite-card--leaving' : ''}`}
      aria-label="Convite para Brasil contra Escócia"
    >
      <div className="matchup" aria-label="Brasil versus Escócia">
        <img className="flag" src="/flags/brasil.png" alt="Bandeira do Brasil" />
        <span className="versus" aria-hidden="true">
          X
        </span>
        <img className="flag" src="/flags/escocia.png" alt="Bandeira da Escócia" />
      </div>

      <div className="copy">
        <p className="eyebrow">Copa do Mundo FIFA 2026</p>
        <h1>
            <span className="headline-line">Quarta a seleção entra em campo e a resenha é aqui em</span>
            <span className="headline-line">e a resenha é aqui em casa!</span>
            <span className="headline-line headline-line--question">Bora?</span>
        </h1>
        <p className="subtitle">Vai rolar churrasquin, pagodin e muito papo furado!</p>
      </div>

      {!isLeaving && (
        <div className="actions" aria-label="Escolher resposta">
          <RunawayButton avoidRef={yesButtonRef} centralRef={cardRef} />
          <button ref={yesButtonRef} className="choice-button choice-button--yes" onClick={onConfirm}>
            <span>Bora!</span>
            <img src="/emojis/safado.png" alt="" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
