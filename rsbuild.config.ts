import { defineConfig } from '@rsbuild/core';
import { pluginSvelte } from '@rsbuild/plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [pluginSvelte()],
  source: {
    // Set the entry point for the application
    entry: {
      index: './src/index.ts',
    },
  },
  tools: {
    // This is the fix: we configure the path alias here.
    rspack: {
      resolve: {
        alias: {
          // Tell Rsbuild that any import starting with '$lib'
          // should be resolved from the 'src/lib' directory.
          $lib: path.resolve(__dirname, 'src/lib'),
        },
      },
    },
  },
});
