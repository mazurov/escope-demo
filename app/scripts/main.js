require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
        esprima: '../components/esprima/esprima',
        estraverse: '../components/estraverse/estraverse',
        escope: '../components/escope/escope',
        hljs: 'vendor/highlight.pack',
        codemirror: '../components/codemirror/lib/codemirror',
        'codemirror.javascript': '../components/codemirror/mode/javascript/javascript'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        codemirror : {
            exports: 'CodeMirror'
        },
        hljs : {
            exports: 'hljs'
        },
        'codemirror.javascript': ['codemirror']
    }
});

require(['app','hljs'], function (app, hljs) {
    'use strict';
    // use app here
    hljs.initHighlighting();
    app.run();
});
