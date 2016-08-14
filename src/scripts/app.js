require('codemirror/lib/codemirror.css');
require('codemirror/theme/monokai.css');
require('../styles/main.css');
require('bootstrap/dist/css/bootstrap.css');


var CodeMirror = require('codemirror');
require('codemirror/mode/javascript/javascript');
var $ = require('jquery');
var escope = require('escope');
var esprima = require('esprima');


var run = function() {
    'use strict';
    var unfold = function(e) {
        e.preventDefault();
        var node = $(this).data('node');
        var level = $(this).data('level');
        var icon = $(this.parentNode).find('i.icon-plus');
        addChilds(this.parentNode, node, level);
        icon.removeClass('icon-plus');
        icon.addClass('icon-minus');
        $(this).unbind('click', unfold);
        $(this).bind('click', fold);
    };

    var fold = function(e) {
        e.preventDefault();
        var icon = $(this.parentNode).find('i.glyphicon-minus');
        icon.removeClass('glyphicon-minus');
        icon.addClass('glyphicon-plus');

        $(this.parentNode).find('ul').remove();
        $(this).unbind('click', fold);
        $(this).bind('click', unfold);
    };

    var addChilds = function(parent, node, level) {
        var childs = document.createElement('ul'),
            child;

        for (var p in node) {
            if (node.hasOwnProperty(p) && node[p]) {
                child = traverseNode(node[p], p, level + 1);
                childs.appendChild(child);
            }
        }
        if (childs.childNodes.length !== 0) {
            parent.appendChild(childs);
        }
    };

    var hasChilds = function(node) {
        var p;
        if (typeof node === 'object') {
            for (p in node) {
                if (node.hasOwnProperty(p)) {
                    return true;
                }
            }
            return false;
        }

        return false;
    };

    var mark;
    var showInEditor = function(loc) {
        if (mark) {
            mark.clear();
        }
        editor.setCursor(loc.start.line - 1, loc.start.column);
        mark = editor.markText({
            line: loc.start.line - 1,
            ch: loc.start.column
        }, {
            line: loc.end.line - 1,
            ch: loc.end.column
        }, {
            className: 'cm-mark'
        });
        editor.focus();
    };

    var traverseNode = function(node, key, level) {
        if (!node) {
            return;
        }
        var name,
            result,
            value,
            innerValue,
            icon,
            locLink;

        name = node.constructor.name;

        if (!level) {
            level = 0;
            result = document.createElement('div');
        } else {
            result = document.createElement('li');
            value = name;
            if (typeof node !== 'object') {
                value = node.toString();
            }
            innerValue = '<b>' + key + '</b>: ' + value;
            if (hasChilds(node)) {
                icon = 'plus';
                innerValue = '<a href="#" class="tree-open"><i class="glyphicon glyphicon-' + icon + '"></i>' + innerValue + '</a> ';
                if (node.hasOwnProperty('loc')) {
                    locLink = $('<a href="#" class="tree-show"><i class="glyphicon glyphicon-hand-right"></i></a>');
                    locLink.click(function(e) {
                        e.preventDefault();
                        showInEditor(node.loc);
                    });
                }
            }
            $(result).html(innerValue);
            if (locLink) {
                $(result).append(locLink);
            }
        }

        if (hasChilds(node)) {
            if (level === 0) {
                addChilds(result, node, level);
            } else {
                $(result).find('a.tree-open').data('node', node);
                $(result).find('a.tree-open').data('level', level);
                $(result).find('a.tree-open').bind('click', unfold);
            }
        }
        if (level === 0) {
            return result.firstChild;
        }
        return result;
    };

    var ecmaVersion = $('input[name="es"]:checked').val();
    var sourceType = $('input[name="st"]:checked').val();
    var body = $("body")
    var draw = function() {
        body.removeClass("bg-danger");
        try{
        var ast = esprima.parse(editor.getValue(), {
            range: true,
            loc: true,
            sourceType: sourceType,
        });
        var scopes = escope.analyze(ast, {sourceType: sourceType, ecmaVersion: parseInt(ecmaVersion)}).scopes;
        } catch(e){
            body.addClass("bg-danger");
            console.error(e);
        }
        $('#treeview').html('');
        var nodes = traverseNode(scopes, true);
        $('#treeview').append(nodes);
    };

    var editor = CodeMirror.fromTextArea($('#editor')[0], {
        viewportMargin: Infinity,
        matchBrackets: true,
        continueComments: 'Enter',
        mode: 'javascript',
        lineNumbers: true
    });


    editor.on('change', draw);
    $('input[name="es"]').change(function() { ecmaVersion = $(this).val(); draw();});
    $('input[name="st"]').change(function() { sourceType = $(this).val(); draw();})

    draw();

    $('#escope-version').text(escope.version);
    $('#esprima-version').text(esprima.version);

};  // end run


run();
