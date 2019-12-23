import {
  FunctionComponentElement,
  useEffect,
} from 'react';
import { Props as ElementProps } from '../components/Element';

type ElementType = FunctionComponentElement<ElementProps>;

const isNodeNotLeaving = (node: ElementType) => !node.props.leave;

const useCleanupTransitions = (
  nodes: ElementType[],
  update: (nodes: ElementType[]) => void,
  duration: number,
) => {
  // once any removed nodes have finished animating
  // we need to actually remove them from the dom
  useEffect(() => {
    const t = setTimeout(() => {
      const newNodes = nodes.filter(isNodeNotLeaving);

      if (newNodes.length !== nodes.length) {
        update(newNodes);
      }
    }, duration);

    return () => {
      clearTimeout(t);
    };
  }, [ nodes ]);
};

export default useCleanupTransitions;
