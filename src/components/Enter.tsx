import React, { forwardRef } from 'react';
import { TransitionProps } from '../types';
import useTransitionState from '../hooks/useTransitionState';

const Enter = forwardRef<any, TransitionProps>((props, ref) => {
  const {
    children,
    component: Wrapper,
    duration,
    render: RenderTransition,
  } = props;

  const state = useTransitionState(
    { enter: true },
    { entering: true },
    { entered: true },
    duration,
  );

  return (
    <RenderTransition
      duration={duration}
      {...state}
    >
      <Wrapper ref={ref}>
        {children}
      </Wrapper>
    </RenderTransition>
  );
});

export default Enter;
