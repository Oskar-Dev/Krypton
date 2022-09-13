import { create, all } from 'mathjs';
const MATHJS = create(all, { predictable: false });
MATHJS.import({
  absR: (x) => Math.abs(x),
});

export { MATHJS };
