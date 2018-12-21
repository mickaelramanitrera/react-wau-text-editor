'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _draftjsToHtml = require('./Converter/draftjs-to-html');

var _draftjsToHtml2 = _interopRequireDefault(_draftjsToHtml);

var _draftJsImportHtml = require('draft-js-import-html');

var _Decorators = require('./Decorators');

var _Decorators2 = _interopRequireDefault(_Decorators);

var _Link = require('./DialogBoxes/Link');

var _Link2 = _interopRequireDefault(_Link);

var _StandardControls = require('./Controls/StandardControls');

var _utils = require('./utils');

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
            var importfromhtml = (0, _draftJsImportHtml.stateFromHTML)((0, _utils.createNonEmptyParagraph)(_this.props.content));
            content = _draftJs.EditorState.createWithContent(importfromhtml, new _draftJs.CompositeDecorator(_Decorators2.default));
        } else {
            content = _draftJs.EditorState.createEmpty(new _draftJs.CompositeDecorator(_Decorators2.default));
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
                    var textInHtml = (0, _utils.createNonEmptyParagraph)((0, _draftjsToHtml2.default)((0, _draftJs.convertToRaw)(editorState.getCurrentContent())));
                    this.props.onChange((0, _utils._linkify_text)(textInHtml));
                } else {
                    this.props.onChange("");
                }
            }
        }
    }, {
        key: '_convertUrlsToHtmlLinks',
        value: function _convertUrlsToHtmlLinks(text) {
            var regx = /((https?:\/\/)?(www.)?[\w]+\.[^\s\<\>\"\'\r\n\%A-F0-9{2}]+)/g;
            return (0, _utils._replaceTxtNotInA)(text, regx);
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
            var entityAtCaret = (0, _utils._getEntityAtCaret)(this.state.editorState);
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
            var entityAtCaret = (0, _utils._getEntityAtCaret)(this.state.editorState);
            var contentStateWithEntity = null;
            if (entityAtCaret !== null && entityAtCaret.getType() === "LINK") {
                //update the old link
                var entityKeyAtCaret = (0, _utils._getEntityAtCaret)(this.state.editorState, true);
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
            contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url: urlValue.includes('http:') === true ? urlValue : 'http:\/\/' + urlValue, target: '_blank' });
            var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            //affect the link entity to the selection
            var withLink = _draftJs.Modifier.applyEntity(this.state.editorState.getCurrentContent(), selection, entityKey);

            var editorStateWithEntity = _draftJs.EditorState.push(this.state.editorState, withLink, 'apply-entity');

            var characterAtEndOfSelection = (0, _utils._getCharacterAtEndOfSelection)(selection, withLink);
            // insert a blank space after link if character after selection is empty
            if (characterAtEndOfSelection === undefined) {

                var collapsedSelection = editorStateWithEntity.getSelection().merge({
                    anchorOffset: selection.get('focusOffset'),
                    focusOffset: selection.get('focusOffset')
                });
                editorStateWithEntity = _draftJs.EditorState.acceptSelection(editorStateWithEntity, collapsedSelection);
                withLink = _draftJs.Modifier.insertText(editorStateWithEntity.getCurrentContent(), collapsedSelection, ' ', editorStateWithEntity.getCurrentInlineStyle(), undefined);
                editorStateWithEntity = _draftJs.EditorState.push(editorStateWithEntity, withLink, 'insert-characters');
            }

            this.setState({
                editorState: editorStateWithEntity,
                urlInputValue: "",
                showInput: false
            });
            this.focusEditor();
        }
    }, {
        key: 'removeLink',
        value: function removeLink() {
            var EditorState = this.state.editorState;
            var entityAtCaret = (0, _utils._getEntityAtCaret)(this.state.editorState);
            var contentState = EditorState.getCurrentContent();
            var contentBlock = contentState.getBlockForKey(EditorState.getSelection().getAnchorKey());
            if (entityAtCaret !== null && entityAtCaret.type === "LINK") {
                //get the selection of the entity
                var entitySelection = (0, _utils._getEntityRange)(entityAtCaret, contentBlock, contentState);
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

            var input = this.state.showInput ? _react2.default.createElement(_Link2.default, {
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
                    _react2.default.createElement(_StandardControls.InlineStyleControls, {
                        editorState: editorState,
                        onToggle: this.toggleInlineStyle
                    })
                ),
                _react2.default.createElement(
                    'div',
                    { className: className, onClick: this.focus },
                    _react2.default.createElement(_draftJs.Editor, {
                        blockStyleFn: _utils.getBlockStyle,
                        customStyleMap: _StandardControls.styleMap,
                        editorState: editorState,
                        handleKeyCommand: this.handleKeyCommand,
                        onChange: this.onChange,
                        onTab: this.onTab,
                        ref: 'editor',
                        spellCheck: true,
                        decorators: _Decorators2.default
                    })
                )
            );
        }
    }]);

    return RichEditor;
}(_react2.default.Component);

exports.default = RichEditor;