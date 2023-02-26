import { rollup } from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import gzipPlugin from 'rollup-plugin-gzip';

const production = process.env.MIX_ENV == "prod";

export default [{
    input: 'src/index.js',
    output: {
        file: 'dist/jsactions.js',
        format: 'es',
        freeze: false,
        name: 'jsactions',
        sourcemap:true
    },
    plugins: [
        resolve({
            module: true,
            jsnext: true,
            main: true,
            modulesOnly: true,
        }),
        
    ]
},
{
    input: 'src/index.js',
    output: {
        file: 'dist/jsactions.min.js',
        format: 'es',
        freeze: false,
        name: 'jsactions',
        sourcemap:false
    },
    plugins: [
        resolve({
            module: true,
            jsnext: true,
            main: true,
            modulesOnly: true,
        }),
        
        terser()
    ]
},
];