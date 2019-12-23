const path = require('path');
const babel = require('rollup-plugin-babel');
const localResolve = require('rollup-plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');

const pkg = require(path.resolve('./package.json'));
const external = Object.keys(pkg.dependencies || {})
  .concat(Object.keys(pkg.peerDependencies || {}));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/es/react-transition.js',
      format: 'es',
    },
    {
      file: 'dist/cjs/react-transition.js',
      format: 'cjs',
    },
  ],
  plugins: [
    localResolve(),
    typescript({
      tsconfig: path.resolve('./tsconfig.json'),
    }),
    babel({
      exclude: 'node_modules/**',
      extensions: [ '.js', '.ts', '.tsx' ],
    }),
  ],
  external,
  onwarn: (warning, warn) => {
    if (warning.code === 'UNRESOLVED_IMPORT') {
      throw new Error(warning.message);
    }
    
    warn(warning);
  },
};
