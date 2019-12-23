import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator(withKnobs);

function loadStories() {
  require('../src/components/__stories__/Transition.story');
}

configure(loadStories, module);
