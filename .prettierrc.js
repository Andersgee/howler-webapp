module.exports = {
  tabWidth: 2,
  printWidth: 120,
  plugins: [require("@trivago/prettier-plugin-sort-imports")],
  importOrder: ["^src/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
