module.exports = {
  '**/*.(js|jsx|ts|tsx)+': [
    (filenames) => filenames.map((filename) => `prettier --write '${filename}'`),
    // (filenames) => (filenames.length ? "eslint --fix ." : `eslint --fix ${filenames.join(" ")}`),
    // () => 'eslint --fix .',
    // () => "yarn tsc:check",
  ],
};
