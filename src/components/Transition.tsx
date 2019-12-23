import React, {
  useState,
  useMemo,
  Children,
  ReactElement,
  FunctionComponentElement,
} from 'react';
import { TransitionProps } from '../types';
import { Props as ElementProps } from './Element';
import defaultRender from './defaultRender';
import useUpdateNodes from '../hooks/useUpdateNodes';
import useCleanupTransitions from '../hooks/useCleanupTransitions';

type ElementType = FunctionComponentElement<ElementProps>;

const Transition = (props: Partial<TransitionProps>) => {
  const {
    duration = 250,
    render = defaultRender,
    component = 'span',
    children,
  } = props;

  const childrenArr = useMemo(() => Children.toArray(children), [ children ]);
  const [ nodes, setNodes ] = useState<ElementType[]>([]);

  useUpdateNodes(
    nodes,
    childrenArr,
    setNodes,
    component,
    duration,
    render,
  );
  useCleanupTransitions(
    nodes,
    setNodes,
    duration,
  );

  return nodes as unknown as ReactElement;
};

export default Transition;
