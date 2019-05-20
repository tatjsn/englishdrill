import { render } from 'lit-html';

export default function(Comp, root, ...props) {
  const states = [];
  const dispatch = (key, value) => {
    states[key] = value;
    update();
  };
  const setters = [];
  const useStateInit = init => {
    states.push(init);
    const index = states.length - 1;
    const setter = value => dispatch(index, value);
    setters.push(setter);
    return [init, setter];
  };
  const effects = [];
  const useEffectInit = (callback, keys) => {
    effects.push([callback, keys]);
  };

  // Initial rendering
  render(Comp(useStateInit, useEffectInit, ...props), root);

  effects.forEach(eff => eff[0]());

  const update = () => {
    let nextStateIndex = 0;
    const useState = () => {
      const index = nextStateIndex;
      nextStateIndex += 1;
      return [states[index], setters[index]];
    };
    const collectedEffects = [];
    const useEffect = (callback, keys) => {
      collectedEffects.push([callback, keys]);
    };
    render(Comp(useState, useEffect, ...props), root);

    collectedEffects.forEach((eff, i) => {
      const [callback, keys] = eff;
      const updated = keys
        .map((kv, ki) => kv !== effects[ki][1])
        .reduce((prev, curr) => prev && curr, false);
      if (updated) {
        callback();
      }
      effects[i] = eff;
    });
  };
}
