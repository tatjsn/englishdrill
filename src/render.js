import { render } from 'lit-html';

// Nested stateful component is not supported
// The easiest solution would be hard boundary using custom element
export default function(Comp, root, ...props) {
  let state = Comp.initialState;
  const dispatch = (key, value) => {
    state = {...state, [key]: value};
    update();
  };
  const setters = Object.keys(state).map(key => value => dispatch(key, value));
  const update = () => {
    render(Comp(...Object.values(state), ...setters, ...props), root);
  };

  update();
  Comp.onInitialRender(...Object.values(state), ...setters, ...props);
  return dispatch;
}
