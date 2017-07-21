'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _reactSelect = require('react-select');

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _draftJsExportHtml = require('draft-js-export-html');

var _draftJsImportHtml = require('draft-js-import-html');

var _linkifyIt = require('linkify-it');

var _linkifyIt2 = _interopRequireDefault(_linkifyIt);

var _tlds = require('tlds');

var _tlds2 = _interopRequireDefault(_tlds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RichEditor = function (_React$Component) {
    _inherits(RichEditor, _React$Component);

    function RichEditor(props) {
        _classCallCheck(this, RichEditor);

        //affect the desired content from props
        var _this = _possibleConstructorReturn(this, (RichEditor.__proto__ || Object.getPrototypeOf(RichEditor)).call(this, props));

        var content = null;
        if (_this.props.content === null || _this.props.content !== "") {
            var importfromhtml = (0, _draftJsImportHtml.stateFromHTML)(_this.props.content);
            content = _draftJs.EditorState.createWithContent(importfromhtml, new _draftJs.CompositeDecorator(decorator));
        } else {
            content = _draftJs.EditorState.createEmpty(new _draftJs.CompositeDecorator(decorator));
        }

        _this.state = { editorState: content, urlInputValue: "", showInput: false, h_styleValue: 'unstyled' };
        _this.focus = function () {
            return _this.refs.editor.focus();
        };
        _this.onChange = function (editorState) {
            return _this._handleChange(editorState);
        };
        _this.handleKeyCommand = function (command) {
            return _this._handleKeyCommand(command);
        };
        _this.onTab = function (e) {
            return _this._onTab(e);
        };
        _this.toggleBlockType = function (type) {
            return _this._toggleBlockType(type);
        };
        _this.toggleInlineStyle = function (style) {
            return _this._toggleInlineStyle(style);
        };
        return _this;
    }

    _createClass(RichEditor, [{
        key: '_handleChange',
        value: function _handleChange(editorState) {
            //verify block styling here
            var Selection = editorState.getSelection();
            var BlockType = editorState.getCurrentContent().getBlockForKey(Selection.getAnchorKey()).getType();
            this.setState({ editorState: editorState, h_styleValue: BlockType });
            if (typeof this.props.onChange === 'function') {
                if (editorState.getCurrentContent().hasText()) {
                    //replace the remaining links to anchors
                    var textInHtml = (0, _draftJsExportHtml.stateToHTML)(editorState.getCurrentContent());
                    this.props.onChange(this._convertUrlsToHtmlLinks(textInHtml));
                } else {
                    this.props.onChange("");
                }
            }
        }
    }, {
        key: '_replaceTxtNotInA',
        value: function _replaceTxtNotInA(html, regex, replace) {

            //just to make the txt parse easily, without (start) or (ends) issue
            html = '>' + html + '<';

            //parse txt between > and < but not follow with</a
            html = html.replace(/>([^<>]+)(?!<\/a)</g, function (match, txt) {
                //now replace the txt
                return '>' + txt.replace(regex, replace) + '<';
            });
            //remove the head > and tail <
            return html.substring(1, html.length - 1);
        }
    }, {
        key: '_convertUrlsToHtmlLinks',
        value: function _convertUrlsToHtmlLinks(text) {
            var regx = /((https?:\/\/)?(www.)?[\w]+\.[^\s\<\>\"\']+)/g;
            return this._replaceTxtNotInA(text, regx, "<a href='$1'>$1</a>");
        }
    }, {
        key: '_handleKeyCommand',
        value: function _handleKeyCommand(command) {
            var editorState = this.state.editorState;

            var newState = _draftJs.RichUtils.handleKeyCommand(editorState, command);
            if (newState) {
                this.onChange(newState);
                return true;
            }
            return false;
        }
    }, {
        key: '_onTab',
        value: function _onTab(e) {
            var maxDepth = 4;
            this.onChange(_draftJs.RichUtils.onTab(e, this.state.editorState, maxDepth));
        }
    }, {
        key: '_toggleBlockType',
        value: function _toggleBlockType(blockType) {
            this.onChange(_draftJs.RichUtils.toggleBlockType(this.state.editorState, blockType));
        }
    }, {
        key: '_toggleInlineStyle',
        value: function _toggleInlineStyle(inlineStyle) {
            this.onChange(_draftJs.RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
        }
    }, {
        key: 'focusEditor',
        value: function focusEditor() {
            document.body.style.overflow = "auto";
            var self = this;
            setTimeout(function () {
                self.focus();
            }, 300);
        }
    }, {
        key: 'promptForLink',
        value: function promptForLink() {
            var contentState = this.state.editorState.getCurrentContent();
            var selection = this.state.editorState.getSelection();
            var linkValue = "";
            //check if there is an entity link now
            var entityAtCaret = this._getEntityAtCaret();
            if (entityAtCaret !== null && entityAtCaret.type === "LINK") {
                linkValue = entityAtCaret.getData().url;
            }
            if (linkValue === "" && selection.isCollapsed()) {
                this.focusEditor();
                return false;
            }
            //set body style
            document.body.style.overflow = "hidden";
            this.setState({ urlInputValue: linkValue, showInput: true });
        }
    }, {
        key: 'confirmLink',
        value: function confirmLink(urlValue) {
            //do nothing if link is empty
            if (urlValue === "") {
                this.focusEditor();
                return false;
            }

            var contentState = this.state.editorState.getCurrentContent();
            var selection = this.state.editorState.getSelection();

            //check if it is already a link there
            var entityAtCaret = this._getEntityAtCaret();
            var contentStateWithEntity = null;
            if (entityAtCaret !== null && entityAtCaret.getType() === "LINK") {
                //update the old link
                var entityKeyAtCaret = this._getEntityAtCaret(true);
                contentStateWithEntity = contentState.replaceEntityData(entityKeyAtCaret, { url: urlValue });

                this.setState({ urlInputValue: "", showInput: false });
                this.focusEditor();
                return true;
            }

            //do not create link if caret selection is collapsed
            if (selection.isCollapsed() && contentStateWithEntity === null) {
                this.focusEditor();
                return false;
            }
            //create an entity
            contentStateWithEntity = contentState.createEntity('LINK', 'SEGMENTED', { url: urlValue });
            var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            //affect the link entity to the selection
            this.setState({
                editorState: _draftJs.RichUtils.toggleLink(this.state.editorState, selection, entityKey),
                urlInputValue: "",
                showInput: false
            });
            this.focusEditor();
        }
    }, {
        key: '_getEntityAtCaret',
        value: function _getEntityAtCaret() {
            var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var selection = this.state.editorState.getSelection();
            var anchorkey = selection.getAnchorKey();
            var contentState = this.state.editorState.getCurrentContent();
            var currentBlockOfContent = contentState.getBlockForKey(anchorkey);
            var anchorCurrentPosition = selection.getAnchorOffset();
            //check if the selection is a link
            var entityIdAtSelection = currentBlockOfContent.getEntityAt(anchorCurrentPosition);
            if (entityIdAtSelection !== null) {
                if (key) {
                    return entityIdAtSelection;
                } else {
                    return contentState.getEntity(entityIdAtSelection);
                }
            }

            return null;
        }
    }, {
        key: '_getEntityRange',
        value: function _getEntityRange(entityToFind, contentBlock, contentState) {
            var range = null;
            contentBlock.findEntityRanges(function (character) {
                var entityKey = character.getEntity();
                if (entityKey === null) {
                    return false;
                }

                var entity = contentState.getEntity(entityKey);
                return entityToFind === entity;
            }, function (start, end) {
                range = new _draftJs.SelectionState({
                    anchorKey: contentBlock.getKey(),
                    anchorOffset: start,
                    focusKey: contentBlock.getKey(),
                    focusOffset: end
                });
            });

            return range;
        }
    }, {
        key: 'removeLink',
        value: function removeLink() {
            var EditorState = this.state.editorState;
            var entityAtCaret = this._getEntityAtCaret();
            var contentState = EditorState.getCurrentContent();
            var contentBlock = contentState.getBlockForKey(EditorState.getSelection().getAnchorKey());
            if (entityAtCaret !== null && entityAtCaret.type === "LINK") {
                //get the selection of the entity
                var entitySelection = this._getEntityRange(entityAtCaret, contentBlock, contentState);
                this.setState({
                    editorState: _draftJs.RichUtils.toggleLink(EditorState, entitySelection, null),
                    urlInputValue: "",
                    showInput: false
                });
            }
            this.focusEditor();
        }
    }, {
        key: 'cancelUrlInput',
        value: function cancelUrlInput() {
            var newState = Object.assign({}, this.state);
            newState.showInput = false;
            this.setState(newState);
            this.focusEditor();
        }
    }, {
        key: 'h_styleChanged',
        value: function h_styleChanged(val) {
            this.setState({
                editorState: _draftJs.RichUtils.toggleBlockType(this.state.editorState, val.value),
                h_styleValue: val.value
            });
            this.focusEditor();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var editorState = this.state.editorState;
            // If the user changes block type before entering any text, we can
            // either style the placeholder or hide it. Let's just hide it now.

            var className = 'RichEditor-editor';
            var contentState = editorState.getCurrentContent();
            if (!contentState.hasText()) {
                if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                    className += ' RichEditor-hidePlaceholder';
                }
            }

            var input = this.state.showInput ? _react2.default.createElement(DraftDialogBox_789789, {
                value: this.state.urlInputValue,
                onSubmit: function onSubmit(urlValue) {
                    return _this2.confirmLink(urlValue);
                },
                onDismiss: this.cancelUrlInput.bind(this)
            }) : null;
            var specialStyleForRemoveLink = {
                position: "absolute",
                top: "1px",
                fontSize: "14px"
            };
            return _react2.default.createElement(
                'div',
                { className: 'RichEditor-root' },
                _react2.default.createElement(
                    'div',
                    { className: 'RichEditor-toolbar' },
                    _react2.default.createElement(BlockStyleControls, {
                        editorState: editorState,
                        onToggle: this.toggleBlockType,
                        h_styleChanged: this.h_styleChanged.bind(this),
                        h_styleValue: this.state.h_styleValue
                    }),
                    _react2.default.createElement(InlineStyleControls, {
                        editorState: editorState,
                        onToggle: this.toggleInlineStyle
                    }),
                    _react2.default.createElement(
                        'div',
                        { className: 'RichEditor-controls' },
                        _react2.default.createElement(
                            'a',
                            { className: 'RichEditor-styleButton', onClick: this.promptForLink.bind(this) },
                            _react2.default.createElement(
                                'i',
                                { className: 'material-icons' },
                                'insert_link'
                            )
                        ),
                        _react2.default.createElement(
                            'a',
                            { className: 'RichEditor-styleButton', onClick: this.removeLink.bind(this) },
                            _react2.default.createElement(
                                'i',
                                { className: 'material-icons', style: specialStyleForRemoveLink },
                                'remove_circle'
                            ),
                            _react2.default.createElement(
                                'i',
                                { className: 'material-icons' },
                                'insert_link'
                            )
                        )
                    ),
                    input
                ),
                _react2.default.createElement(
                    'div',
                    { className: className, onClick: this.focus },
                    _react2.default.createElement(_draftJs.Editor, {
                        blockStyleFn: getBlockStyle,
                        customStyleMap: styleMap,
                        editorState: editorState,
                        handleKeyCommand: this.handleKeyCommand,
                        onChange: this.onChange,
                        onTab: this.onTab,
                        ref: 'editor',
                        spellCheck: true,
                        decorators: decorator
                    })
                )
            );
        }
    }]);

    return RichEditor;
}(_react2.default.Component);

exports.default = RichEditor;

var DraftDialogBox_789789 = function (_React$Component2) {
    _inherits(DraftDialogBox_789789, _React$Component2);

    function DraftDialogBox_789789(props) {
        _classCallCheck(this, DraftDialogBox_789789);

        var _this3 = _possibleConstructorReturn(this, (DraftDialogBox_789789.__proto__ || Object.getPrototypeOf(DraftDialogBox_789789)).call(this, props));

        _this3.state = {
            urlValue: props.value
        };
        return _this3;
    }

    _createClass(DraftDialogBox_789789, [{
        key: 'onChange',
        value: function onChange(event) {
            this.setState({ urlValue: event.target.value });
        }
    }, {
        key: 'submitChanges',
        value: function submitChanges() {
            this.props.onSubmit(this.state.urlValue);
        }
    }, {
        key: '_onLinkInputKeyDown',
        value: function _onLinkInputKeyDown(e) {
            if (e.which === 13) {
                this.submitChanges();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'drafts-dialog-box' },
                    _react2.default.createElement(
                        'div',
                        { className: 'drafts-dialog-box-content' },
                        _react2.default.createElement(
                            'h5',
                            null,
                            _react2.default.createElement(
                                'i',
                                { className: 'material-icons left' },
                                'link'
                            ),
                            'Add/Edit link'
                        ),
                        _react2.default.createElement(
                            'p',
                            null,
                            _react2.default.createElement('input', { type: 'text', value: this.state.urlValue, onChange: this.onChange.bind(this),
                                autoFocus: true, onKeyDown: this._onLinkInputKeyDown.bind(this) })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'drafts-dialog-box-footer' },
                        _react2.default.createElement(
                            'a',
                            { className: 'btn-floating btn-small grey', onClick: this.props.onDismiss },
                            _react2.default.createElement(
                                'i',
                                {
                                    className: 'material-icons left' },
                                'clear'
                            )
                        ),
                        _react2.default.createElement(
                            'a',
                            { className: 'btn-floating btn-small grey', onClick: this.submitChanges.bind(this) },
                            _react2.default.createElement(
                                'i',
                                {
                                    className: 'material-icons left' },
                                'check'
                            )
                        )
                    )
                ),
                _react2.default.createElement('div', { className: 'drafts-dialog-overlay', onClick: this.props.onDismiss })
            );
        }
    }]);

    return DraftDialogBox_789789;
}(_react2.default.Component);

var styles = {
    root: {
        fontFamily: '\'Georgia\', serif',
        padding: 20,
        width: 600
    },
    buttons: {
        marginBottom: 10
    },
    urlInputContainer: {
        marginBottom: 10
    },
    urlInput: {
        fontFamily: '\'Georgia\', serif',
        marginRight: 10,
        padding: 3
    },
    editor: {
        border: '1px solid #ccc',
        cursor: 'text',
        minHeight: 80,
        padding: 10
    },
    button: {
        marginTop: 10,
        textAlign: 'center'
    },
    link: {
        color: '#3b5998',
        textDecoration: 'underline'
    }
};

// Custom overrides for "code" style.
var styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2
    }
};
var getBlockStyle = function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return null;
    }
};

var StyleButton = function (_React$Component3) {
    _inherits(StyleButton, _React$Component3);

    function StyleButton() {
        _classCallCheck(this, StyleButton);

        var _this4 = _possibleConstructorReturn(this, (StyleButton.__proto__ || Object.getPrototypeOf(StyleButton)).call(this));

        _this4.onToggle = function (e) {
            e.preventDefault();
            _this4.props.onToggle(_this4.props.style);
        };
        return _this4;
    }

    _createClass(StyleButton, [{
        key: 'render',
        value: function render() {
            var className = 'RichEditor-styleButton';
            if (this.props.active) {
                className += ' RichEditor-activeButton';
            }
            return _react2.default.createElement(
                'a',
                { className: className, onMouseDown: this.onToggle },
                _react2.default.createElement(
                    'i',
                    { className: 'material-icons' },
                    this.props.label
                )
            );
        }
    }]);

    return StyleButton;
}(_react2.default.Component);

var BLOCK_TYPES = [{ label: 'format_quote', style: 'blockquote' }, { label: 'format_list_bulleted', style: 'unordered-list-item' }, { label: 'format_list_numbered', style: 'ordered-list-item' }, { label: 'code', style: 'code-block' }];
var H_STYLES = [{ label: "Normal", value: 'unstyled' }, { label: 'H1', value: 'header-one' }, { label: 'H2', value: 'header-two' }, { label: 'H3', value: 'header-three' }, { label: 'H4', value: 'header-four' }, { label: 'H5', value: 'header-five' }, { label: 'H6', value: 'header-six' }];

var BlockStyleControls = function BlockStyleControls(props) {
    var editorState = props.editorState;

    var selection = editorState.getSelection();
    var blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
    return _react2.default.createElement(
        'div',
        { className: 'RichEditor-controls' },
        _react2.default.createElement(_reactSelect2.default, {
            value: props.h_styleValue,
            options: H_STYLES,
            onChange: props.h_styleChanged,
            clearable: false
        }),
        BLOCK_TYPES.map(function (type) {
            return _react2.default.createElement(StyleButton, {
                key: type.label,
                active: type.style === blockType,
                label: type.label,
                onToggle: props.onToggle,
                style: type.style
            });
        })
    );
};
var INLINE_STYLES = [{ label: 'format_bold', style: 'BOLD' }, { label: 'format_italic', style: 'ITALIC' }, { label: 'format_underline', style: 'UNDERLINE' }, { label: 'text_format', style: 'CODE' }];
var InlineStyleControls = function InlineStyleControls(props) {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return _react2.default.createElement(
        'div',
        { className: 'RichEditor-controls' },
        INLINE_STYLES.map(function (type) {
            return _react2.default.createElement(StyleButton, {
                key: type.label,
                active: currentStyle.has(type.style),
                label: type.label,
                onToggle: props.onToggle,
                style: type.style
            });
        })
    );
};

/*Decorators functions*/
/**********************/
var findLinkEntities = function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function (character) {
        var entityKey = character.getEntity();
        return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
    }, callback);
};
var Link = function Link(props) {
    var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
        url = _props$contentState$g.url;

    return _react2.default.createElement(
        'a',
        { href: url, style: styles.link, target: '_blank' },
        props.children
    );
};
var FindNormalLinks = function FindNormalLinks(contentBlock, callback, contentState) {
    var linkify = (0, _linkifyIt2.default)();
    linkify.tlds(_tlds2.default);

    var links = linkify.match(contentBlock.get('text'));
    if (typeof links !== 'undefined' && links !== null) {
        links.map(function (link) {
            callback(link.index, link.lastIndex);
        });
    }
};
var NormalLink = function NormalLink(props) {
    return _react2.default.createElement(
        'a',
        { href: props.children, style: styles.link, target: '_blank' },
        props.children
    );
};

/*Decorator*/
/**********************/
var decorator = [{
    strategy: findLinkEntities,
    component: Link
}, {
    strategy: FindNormalLinks,
    component: NormalLink
}];

