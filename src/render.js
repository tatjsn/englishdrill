import { render } from 'lit-html';

// Nested stateful component is not supported
// The easiest solution would be hard boundary using custom element
export default function(Comp, root, ...props) {
  const state = [...Comp.initialState]; // Clone
  const dispatch = (key, value) => {
    state[key] = value;
    console.log('state', state);
    update();
  };
  const setters = state.map((_, i) => value => dispatch(i, value));
  const update = () => {
    console.log('state2', state);
    render(Comp(...state, ...setters, ...props), root);
  };

  update();
  Comp.onInitialRender(...Object.values(state), ...setters, ...props);
}
