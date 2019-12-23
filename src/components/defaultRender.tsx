import React from 'react';
import { Render } from '../types';

const defaultRender: Render = ({ children }) => (
  <>
    {children}
  </>
);

export default defaultRender;
