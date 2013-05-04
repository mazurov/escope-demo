/*global define, escope */
define(['jquery', 'esprima', 'codemirror', 'codemirror.javascript'],
                                    function($, esprima, CodeMirror) {
    'use strict';
    var exports = {};
    exports.run = function() {
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
            var icon = $(this.parentNode).find('i.icon-minus');
            icon.removeClass('icon-minus');
            icon.addClass('icon-plus');

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
                    innerValue = '<a href="#" class="tree-open"><i class="icon-' + icon + '"></i>' + innerValue + '</a> ';
                    if (node.hasOwnProperty('loc')) {
                        locLink = $('<a href="#" class="tree-show"><i class="icon-hand-left"></i></a>');
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

        var draw = function() {
            var ast = esprima.parse(editor.getValue(), {
                range: true,
                loc: true
            });
            var scopes = escope.analyze(ast).scopes;
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
        draw();

    };  // end run
    return exports;
});  // End define
