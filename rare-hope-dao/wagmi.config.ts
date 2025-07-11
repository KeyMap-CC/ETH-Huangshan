import { defineConfig } from '@wagmi/cli';
import { foundry, react } from '@wagmi/cli/plugins';
import * as chains from 'wagmi/chains';

export default defineConfig({
  out: 'src/hooks/contractHooks.testnet.ts',
  plugins: [
    foundry({
      deployments: {
        DaoContract: {
          [chains.holesky.id]: '0x2D4Eda9DA70aC43AedceE5BF1319798F485852DB',
        },
      },
      project: './contracts',
      include: ['DaoContract.json'],
    }),
    react(),
  ],
});
