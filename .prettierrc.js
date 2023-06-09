module.exports = {
  plugins: [require("@trivago/prettier-plugin-sort-imports")],
  tabWidth: 2,
  printWidth: 120,
  importOrder: ["^components/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
