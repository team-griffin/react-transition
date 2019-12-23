import {
  useState,
  useCallback,
} from 'react';

const useNodeRef = () => {
  const [ domNode, setDomNode ] = useState<Element>(null);
  const ref = useCallback((node) => {
    if (node != null) {
      setDomNode(node);
    }
  }, []);

  return [ domNode, ref ] as [ typeof domNode, typeof ref ];
};

export default useNodeRef;
