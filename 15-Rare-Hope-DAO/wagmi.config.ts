import { defineConfig } from '@wagmi/cli';
import { foundry, react } from '@wagmi/cli/plugins';
import * as chains from 'wagmi/chains';

export default defineConfig({
  out: 'src/hooks/contractHooks.testnet.ts',
  plugins: [
    foundry({
      deployments: {
        DaoContract: {
          [chains.holesky.id]: '0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b',
        },
      },
      project: './contracts',
      include: ['DaoContract.json'],
    }),
    react(),
  ],
});
