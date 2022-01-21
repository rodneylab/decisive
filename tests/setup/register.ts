import path from 'path';
import { execSync } from 'child_process';
import { compile } from 'svelte/compiler';
import getSvelteConfig from './svelteconfig.cjs';

import 'dotenv/config';

const processSync =
  (options = {}) =>
  (source, filename) => {
    const { debug, preprocess, rootMode } = options;
    let processed = source;
    if (preprocess) {
      const svelteConfig = getSvelteConfig(rootMode, filename);
      const preprocessor = require.resolve('./preprocess.js');
      processed = execSync(
        `node -r dotenv/config --unhandled-rejections=strict --abort-on-uncaught-exception "${preprocessor}"`,
        { env: { PATH: process.env.PATH, source, filename, svelteConfig } }
      ).toString();
      if (debug) console.log(processed);
      return processed;
    } else {
      return source;
    }
  };

async function transform(hook, source, filename) {
  const { name } = path.parse(filename);
  const preprocessed = processSync({ preprocess: true })(source, filename);

  const { js, warnings } = compile(preprocessed, {
    name: name[0].toUpperCase() + name.substring(1),
    format: 'cjs',
    filename
  });

  warnings.forEach((warning) => {
    console.warn(`\nSvelte Warning in ${warning.filename}:`);
    console.warn(warning.message);
    console.warn(warning.frame);
  });

  return hook(js.code, filename);
}

async function main() {
  const loadJS = require.extensions['.js'];

  // Runtime DOM hook for require("*.svelte") files
  // Note: for SSR/Node.js hook, use `svelte/register`
  require.extensions['.svelte'] = function (mod, filename) {
    const orig = mod._compile.bind(mod);
    mod._compile = async (code) => transform(orig, code, filename);
    loadJS(mod, filename);
  };
}

main();
