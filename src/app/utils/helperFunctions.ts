// a function to decide if the supplied membership level is able to access the supplied item level
export const decideIfLocked = (
  userLevel: string,
  itemLevel: string
): boolean => {
  const levels = ["free", "silver", "gold", "platinum"];
  return levels.indexOf(userLevel) < levels.indexOf(itemLevel);
};
