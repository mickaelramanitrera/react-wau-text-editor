'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InlineStyleControls = exports.BlockStyleControls = exports.StyleButton = exports.styleMap = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelect = require('react-select');

var _reactSelect2 = _interopRequireDefault(_reactSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Custom overrides for "code" style.
var styleMap = exports.styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2
    }
};

/**
 * Component for buttons
 */

var StyleButton = exports.StyleButton = function (_React$Component) {
    _inherits(StyleButton, _React$Component);

    function StyleButton() {
        _classCallCheck(this, StyleButton);

        var _this = _possibleConstructorReturn(this, (StyleButton.__proto__ || Object.getPrototypeOf(StyleButton)).call(this));

        _this.onToggle = function (e) {
            e.preventDefault();
            _this.props.onToggle(_this.props.style);
        };
        return _this;
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

/**
 *
 * Button types to render
 */


var BLOCK_TYPES = [{ label: 'format_quote', style: 'blockquote' }, { label: 'format_list_bulleted', style: 'unordered-list-item' }, { label: 'format_list_numbered', style: 'ordered-list-item' }, { label: 'code', style: 'code-block' }];
var H_STYLES = [{ label: "Normal", value: 'unstyled' }, { label: 'H1', value: 'header-one' }, { label: 'H2', value: 'header-two' }, { label: 'H3', value: 'header-three' }, { label: 'H4', value: 'header-four' }, { label: 'H5', value: 'header-five' }, { label: 'H6', value: 'header-six' }];
var INLINE_STYLES = [{ label: 'format_bold', style: 'BOLD' }, { label: 'format_italic', style: 'ITALIC' }, { label: 'format_underline', style: 'UNDERLINE' }, { label: 'text_format', style: 'CODE' }];

/**
 * Block buttons rendering
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
var BlockStyleControls = exports.BlockStyleControls = function BlockStyleControls(props) {
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

/**
 * Inline buttons rendering
 * @param props
 * @returns {XML}
 * @constructor
 */
var InlineStyleControls = exports.InlineStyleControls = function InlineStyleControls(props) {
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