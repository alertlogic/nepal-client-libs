import rollupPluginTypescript2 from 'rollup-plugin-typescript2';
import packageJson from './packages/iris-client/package.json';
// import {terser} from "rollup-plugin-terser";

export default {
    input: 'src/index.ts', // our source file
    output: [
        {
            file: packageJson.main,
            format: "cjs",
            sourcemap: true,
        },
        {
            file: packageJson.module,
            format: 'es',
            sourcemap: true,
        },
    ],
    external: [
        ...Object.keys(packageJson.dependencies || {}),
    ],
    plugins: [
        rollupPluginTypescript2({
            typescript: require('typescript'),
        }),
        // terser() // minifies generated bundles
    ],
};
