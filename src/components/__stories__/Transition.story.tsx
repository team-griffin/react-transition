import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import Transition from '../Transition';
import { Render } from '../../types';

declare const If: any;
declare const For: any;
declare const item: string;
declare const i: number;

const Animate: Render = ({
  enter,
  entering,
  entered,
  duration,
  children,
  leave,
  leaving,
  left,
}) => {
  const styles = {
    transition: `all ${duration}ms`,
    opacity: (entering || entered || leave) ? 1 : 0,
    color: (leaving || left) ? 'red' : (enter) ? 'green' : 'black',
  };

  return (
    <div style={styles}>{children}</div>
  );
};

storiesOf('Common / Transition', module)
  .add('Default', () => {
    const duration = 1000;
    const [ show, setShow ] = useState(true);
    const [ name, setName ] = useState('Frank');
    const changeName = (name: string) => {
      setName(name);
    };
    const toggleName = () => {
      changeName(name === 'Frank' ? 'Jim' : 'Frank')
    };
    const hide = () => {
      setShow(false);
    };
    const unhide = () => {
      setShow(true);
    };

    return (
      <div>
        <button onClick={toggleName}>Change Name</button>
        <If condition={show}>
          <button onClick={hide}>Hide</button>
        </If>
        <If condition={!show}>
          <button onClick={unhide}>Show</button>
        </If>
        <Transition
          duration={duration}
          render={Animate}
        >
          <If condition={show}>
            <div>{`hello ${name}`}</div>
          </If>
        </Transition>
      </div>
    );
  })
  .add('List', () => {
    const [ id, setId ] = useState(0);
    const [ list, setList ] = useState([]);
    const addItem = () => {
      setId(id + 1);
      setList([
        ...list,
        `Item ${id}`,
      ]);
    };
    const removeItem = (i: number) => () => {
      const newList = list.slice();
      newList.splice(i, 1);
      setList(newList);
    };

    return (
      <div>
        <button onClick={addItem}>Add an item</button>
        <Transition
          duration={250}
          render={Animate}
        >
          <For
            each="item"
            of={list}
            index="i"
          >
            <div key={item}>
              {item}
              <button onClick={removeItem(i)}>Remove</button>
            </div>
          </For>
        </Transition>
      </div>
    );
  })
  .add('with connected children', () => {
    const initialState = {
      product: {
        name: 'Jim',
      },
    };
    const store = createStore((state = initialState, action) => {
      switch (action.type) {
      case 'EMPTY_PRODUCT':
        return {
          ...state,
          product: null,
        };
      default:
        return state;
      }
    });

    const Product = () => {
      const name = useSelector((state: any) => state.product.name);

      return (
        <div>{`name: ${name}`}</div>
      );
    };

    const App = () => {
      const dispatch = useDispatch();
      const hasProduct = useSelector((state: any) => state.product != null);
      const handleRemoveProduct = () => {
        dispatch({ type: 'EMPTY_PRODUCT' });
      };

      return (
        <div>
          <Transition
            render={Animate}
            duration={3000}
          >
            <If condition={hasProduct}>
              <Product/>
            </If>
          </Transition>
          <button onClick={handleRemoveProduct}>Remove</button>
        </div>
      );

    };

    return (
      <Provider store={store}>
        <App/>
      </Provider>
    );
  });
