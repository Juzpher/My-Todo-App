export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return;
  const names = name.split(" ");
  let initials = "";
  for (let i = 0; i < names.length; i++) {
    initials += names[i][0];
  }
  return initials.toUpperCase();
};
