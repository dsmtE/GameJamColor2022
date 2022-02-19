import { setEquality } from "./setUtils";

export function ComputeMixing(inputElements, recipes) {
  const findIndex = recipes.findIndex(({ input, _ }) => {
    return setEquality(new Set([...inputElements]), new Set([...input]));
  });

  return findIndex !== -1 ? recipes[findIndex].output : undefined;
}
