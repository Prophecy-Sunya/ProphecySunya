import { Link } from '@heroui/link';
import { Snippet } from '@heroui/snippet';
import { Code } from '@heroui/code';
import { button as buttonStyles } from '@heroui/theme';

import { siteConfig } from '@/config/site';
import { title, subtitle } from '@/components/primitives';
import { GithubIcon } from '@/components/icons';
import PredictionCard from '@/components/prediction-card';
import { predictions } from './mockdata';

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title({ color: 'yellow' })}>Prophecy Sunya&nbsp;</span>
        <br />
        <div className={subtitle({ class: 'mt-4' })}>
          Decentralized Prediction Markets on Starknet.
        </div>
      </div>

      {/* Latest Predictions */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {predictions.map((prediction) => (
          <PredictionCard
            category={prediction.category}
            content={prediction.content}
            creator={prediction.creator}
            expirationTime={prediction.expirationTime}
            verificationStatus={prediction.verificationStatus}
            id={prediction.id}
          />
        ))}
      </div>
    </section>
  );
}
