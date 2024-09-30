import globals from 'globals'
import pluginJs from '@eslint/js'
// console.log(globals.browser, globals.node)
// eslint9 需要node18
export default [
    {
        ignores: ['dist', 'coverage']
    },
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.amd
            }
        },
        rules: {
            // 'no-console': 'off'
        }
    },
    pluginJs.configs.recommended
]
