import { useEffect, useState } from 'react';
import { CelebrationEffects } from './components/CelebrationEffects';
import { FinalScreen } from './components/FinalScreen';
import { InviteCard } from './components/InviteCard';

type Stage = 'invite' | 'celebrating' | 'final';

export default function App() {
  const [stage, setStage] = useState<Stage>('invite');

  const confirmPresence = () => {
    if (stage !== 'invite') {
      return;
    }

    setStage('celebrating');
  };

  useEffect(() => {
    if (stage !== 'celebrating') {
      return;
    }

    const timer = window.setTimeout(() => {
      setStage('final');
    }, 3400);

    return () => window.clearTimeout(timer);
  }, [stage]);

  return (
    <main className={`app-shell app-shell--${stage}`}>
      <div className="ambient ambient--green" />
      <div className="ambient ambient--blue" />
      <div className="ambient ambient--white" />

      {(stage === 'invite' || stage === 'celebrating') && (
        <InviteCard isLeaving={stage === 'celebrating'} onConfirm={confirmPresence} />
      )}

      {stage === 'celebrating' && <CelebrationEffects />}

      {stage === 'final' && <FinalScreen />}
    </main>
  );
}
