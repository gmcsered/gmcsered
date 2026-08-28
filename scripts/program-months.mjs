export const slovakMonthNames = [
  "Január",
  "Február",
  "Marec",
  "Apríl",
  "Máj",
  "Jún",
  "Júl",
  "August",
  "September",
  "Október",
  "November",
  "December",
];

export function isProgramMonthId(value) {
  return /^\d{4}-\d{2}$/.test(value ?? "");
}

export function programMonthName(monthId) {
  if (!isProgramMonthId(monthId)) return monthId || "Program";
  const month = Number(monthId.slice(5));
  return slovakMonthNames[month - 1] ?? monthId;
}

export function programMonthLabel(monthId) {
  if (!isProgramMonthId(monthId)) return monthId || "Program";
  return `${programMonthName(monthId)} ${monthId.slice(0, 4)}`;
}

export function compareProgramMonthIds(left, right) {
  return (left || "").localeCompare(right || "", "sk", { numeric: true, sensitivity: "base" });
}
