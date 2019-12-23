import {
  FunctionComponent,
  ReactNode,
  ElementType,
} from 'react';

export interface TransitionStateProps {
  enter: boolean,
  entering: boolean,
  entered: boolean,
  leave: boolean,
  leaving: boolean,
  left: boolean,
}

export interface RenderProps extends TransitionStateProps {
  duration: number,
  children: ReactNode,
}

export type Render = FunctionComponent<RenderProps>;

export interface TransitionProps {
  children: ReactNode,
  component: ElementType,
  duration: number,
  render: Render,
}
