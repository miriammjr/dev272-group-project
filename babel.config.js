module.exports = {
  presets: [
    '@babel/preset-typescript',

    [
      '@babel/preset-env',

      {
        targets: { esmodules: false, node: 'current' },
      },
    ],
    '@babel/preset-react',
  ],

  plugins: [],
};
