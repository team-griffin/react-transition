import React, {
  useMemo,
  cloneElement,
  FunctionComponentElement,
  ReactNode,
} from 'react';
import { Render, TransitionProps } from '../types';
import Element, { Props as ElementProps } from '../components/Element';

type ElementType = FunctionComponentElement<ElementProps>;

const getKeys = (nodes: ReactNode[]) => React.Children.map(nodes, (child: { key: string }) => {
  return child.key;
});

const removeNode = (
  nodes: ElementType[],
  childKeys: string[],
  component: TransitionProps['component'],
  duration: number,
  render: Render,
  key: string,
  i: number,
) => {
  let node: ElementType = nodes[i];
  // if the node doesn't exist in children but exists in nodes
  // then it's been removed from the dom
  if (childKeys.indexOf(key) >= 0) {
    return false;
  }
  // if it's already being removed we can skip it
  if (node.props.leave) {
    return false;
  }
  // if it's currently entering, lift up the inner element
  if (node.props.enter) {
    // @ts-ignore
    node = node.props.children;
  }

  // wrap the node in a <Leave> that handles the transition state
  nodes[i] = (
    <Element
      key={key}
      component={component}
      duration={duration}
      render={render}
      enter={false}
      leave={true}
    >
      {node}
    </Element>
  );

  return true;
};

const addNode = (
  nodes: ElementType[],
  children: ReactNode[],
  nodeKeys: string[],
  component: TransitionProps['component'],
  duration: number,
  render: Render,
  key: string,
  x: number,
) => {
  const child = children[x];
  const i = nodeKeys.indexOf(key);

  // if we already have this node we can skip it
  if (i >= 0) {
    if (!nodes[i].props.leave) {
      return false;
    }
    // if the node is currently transitioning out, we should help it
    // along and then treat it as a new node
    nodes.splice(i, 1);
  }


  nodes.splice(x, 0, (
    <Element
      key={key}
      component={component}
      duration={duration}
      render={render}
      enter={true}
      leave={false}
    >
      {child}
    </Element>
  ));

  return true;
};

const updateNode = (
  nodes: ReactNode[],
  children: ReactNode[],
  nodeKeys: string[],
  key: string,
  x: number,
) => {
  const child = children[x];
  const i = nodeKeys.indexOf(key);
  const node = nodes[i] as ElementType;

  // only do stuff when this node already exists
  if (i < 0) {
    return false;
  }


  // check if the child has changed
  if (node.props.children !== child) {
    // we want to clone the existing element and just replace the children prop
    nodes[i] = cloneElement(
      node,
      {
        ...node.props,
        children: child,
      },
      child,
    );
    return true;
  }

  return false;
};

const useUpdateNodes = (
  nodes: ElementType[],
  children: ReactNode[],
  update: (nodes: ElementType[]) => void,
  component: TransitionProps['component'],
  duration: number,
  render: Render,
) => {
  // we use keys to match up the latest children to the previous nodes
  const nodeKeys = useMemo(() => getKeys(nodes), [ nodes ]);
  const childKeys = useMemo(() => getKeys(children), [ children ]);

  let shouldUpdate = false;
  // we calculate the new nodes inside a useMemo so we don't do it every single render
  // we have a dirty let above so we can work out whether to update our nodes, even if
  // useMemo just returns the cached value
  const newNodes = useMemo(() => {
    // we're going to create a fresh nodes array and then mutate it as we do our checks
    const newNodes = nodes.slice();

    const anyRemoved = nodeKeys.reduce((flag, key, i) => {
      const removed = removeNode(
        newNodes,
        childKeys,
        component,
        duration,
        render,
        key,
        i,
      );
      return removed || flag;
    }, false);

    const anyUpdated = childKeys.reduce((flag, key, i) => {
      const added = addNode(
        newNodes,
        children,
        nodeKeys,
        component,
        duration,
        render,
        key,
        i,
      );
      // only run the update check if we haven't just added the node
      const updated = added ? false : updateNode(
        newNodes,
        children,
        nodeKeys,
        key,
        i,
      );

      return added || updated || flag;
    }, false);

    shouldUpdate = anyRemoved || anyUpdated || shouldUpdate;

    return newNodes;

  }, [ children ]);

  // normally we would do this inside a useEffect but we need to do it immediately
  // otherwise we might attempt to render stuff whose internal state is messed up
  if (shouldUpdate) {
    update(newNodes);
  }
};

export default useUpdateNodes;
