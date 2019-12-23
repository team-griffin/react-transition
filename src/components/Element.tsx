import React from 'react';
import { TransitionProps } from '../types';
import useNodeRef from '../hooks/useNodeRef';
import Enter from './Enter';
import Leave from './Leave';

export interface Props extends TransitionProps {
  enter: boolean,
  leave: boolean,
}

const Element = (props: Props) => {
  const {
    children,
    component,
    duration,
    enter,
    leave,
    render,
  } = props;
  const [ node, ref ] = useNodeRef();

  if (leave) {
    const html = node.innerHTML;
    return (
      <Leave
        component={component}
        duration={duration}
        render={render}
        html={html}
      />
    );
  }

  return (
    <Enter
      component={component}
      duration={duration}
      render={render}
      ref={ref}
    >
      {children}
    </Enter>
  );
};

export default Element;
