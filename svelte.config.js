import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    paths: {
      base: dev ? '' : process.env.BASE_PATH,
    },
    csrf:{
      checkOrigin:false
    }
  },
  compilerOptions: {
    accessors: process.env.TEST,
  },
};
export default config;