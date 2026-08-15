export const getSundayServiceMessage = (now = new Date()) => {
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const serviceStart = 9 * 60 + 30;

  if (day === 0 && minutes < serviceStart) {
    return "Dnes sa vidíme o 9:30.";
  }

  if (day === 0) {
    return "Najbližšie sa stretneme opäť v nedeľu o 9:30.";
  }

  return "Najbližšia bohoslužba je v nedeľu o 9:30.";
};
