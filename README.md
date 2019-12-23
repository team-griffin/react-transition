# react-transition
Basic usage:
```tsx
import Transition from '@team-griffin/react-transition';

<Transition>
  <Child/>
</Transition>
```

It also works out the box with list-style children:
```tsx
<Transition>
  <Child1 key="1"/>
  <Child2 key="2"/>
  <Child3 key="3"/>
</Transition>
```
It's important to provide a key for each child as we use this to determine which list items have updated between renders.

## props
### duration
The animation duration. Defaults to `250`.
```tsx
<Transition duration={1000}>
  <Child/>
</Transition>
```

### render
This is a render function that actually sets the css styles. It is given the following props:
```ts
{
  enter: boolean, // true when the component is first mounted
  entering: boolean, // true during the transition period
  entered: boolean, // true when the transition period has ended
  leave: boolean, // true when the component is about to unmount
  leaving: boolean, // true during the transition period
  left: boolean, // true when the component has unounted
  duration: number,
  children: ReactNode,
}
```

A typical example of a render function would look something like this:
```tsx
const render = ({
  enter,
  entering,
  entered,
  leave,
  leaving,
  left,
  children,
  duration,
}) => {
  const styles = {
    transition: `all ${duration}ms`,
    opacity: (entering || entered || leave) ? 1 : 0,
  };

  return <div style={styles}>{children}</div>
};

<Transition render={render}>
  <Child/>
</Transition>
```

### component
An element must wrap the transition in order to track the dom state. You can pass in a string for a native dom elment i.e. `span` or `div`.
```tsx
<Transition component="span">
  <Child/>
</Transition>
```

If you want to pass in a component, you need to be able to accept a `ref` and apply it to an element. For example:
```tsx
import { forwardRef } from 'react';

const Wrapper = forwardRef(({ children }, ref) => (
  <div ref={ref}>
    {children}
  </div>
))
```

So what makes this different to other transition libraries? It all lies in the unmounting logic. If you drop a component, usually the component is retained and rendered with the previous props for the duration of the transition. However, this all falls apart when you have nested components that have their own state or rely on redux state.

```tsx
<Transition>
  <ConnectedChild/>
</Transition>
```
If your child component assumes it will only be rendered when certain global state is set, then if you continue to re-render it during a transition phase, when the global state is no longer available, it wall probably collapse.

We actually get around this problem by stashing the child's dom node, and rendering a static version of the component when it unmounts. Magic.
