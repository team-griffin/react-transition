const browserEnv = require('browser-env');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const babel = require('@babel/register');

browserEnv();
enzyme.configure({ adapter: new Adapter() });
babel({
  extensions: [ '.js', '.ts', '.tsx' ],
});
