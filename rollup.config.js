import babel from '@rollup/plugin-babel';

export default {
	input: 'src/index.js',
	output: [
		{
			file: 'dist/lb-utils.esm.js',
			format: 'es'
		},
		{
			file: 'dist/lb-utils.umd.js',
			format: 'umd',
			name: 'LBUtils'
		}
	],
	plugins: [
		babel({ babelHelpers: 'bundled' })
	]
}