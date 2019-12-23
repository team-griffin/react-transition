import React, { forwardRef } from 'react';
import { Omit } from 'utility-types';
import { TransitionProps } from '../types';
import useTransitionState from '../hooks/useTransitionState';

interface Props extends Omit<TransitionProps, 'children'> {
  html: string,
}

const Leave = (props: Props) => {
  const {
    component: Wrapper,
    duration,
    render: RenderTransition,
    html,
  } = props;

  const state = useTransitionState(
    { leave: true },
    { leaving: true },
    { left: true },
    duration,
  );

  return (
    <RenderTransition
      duration={duration}
      {...state}
    >
      <Wrapper
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </RenderTransition>
  );
};

export default Leave;
