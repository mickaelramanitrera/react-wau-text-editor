"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DraftDialogBox_789789 = function (_Component) {
    _inherits(DraftDialogBox_789789, _Component);

    function DraftDialogBox_789789(props) {
        _classCallCheck(this, DraftDialogBox_789789);

        var _this = _possibleConstructorReturn(this, (DraftDialogBox_789789.__proto__ || Object.getPrototypeOf(DraftDialogBox_789789)).call(this, props));

        _this.state = {
            urlValue: props.value
        };
        return _this;
    }

    _createClass(DraftDialogBox_789789, [{
        key: "onChange",
        value: function onChange(event) {
            this.setState({ urlValue: event.target.value });
        }
    }, {
        key: "submitChanges",
        value: function submitChanges() {
            this.props.onSubmit(this.state.urlValue);
        }
    }, {
        key: "_onLinkInputKeyDown",
        value: function _onLinkInputKeyDown(e) {
            if (e.which === 13) {
                this.submitChanges();
            }
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(
                    "div",
                    { className: "drafts-dialog-box" },
                    _react2.default.createElement(
                        "div",
                        { className: "drafts-dialog-box-content" },
                        _react2.default.createElement(
                            "h5",
                            null,
                            _react2.default.createElement(
                                "i",
                                { className: "material-icons left" },
                                "link"
                            ),
                            "Add/Edit link"
                        ),
                        _react2.default.createElement(
                            "p",
                            null,
                            _react2.default.createElement("input", { type: "text", value: this.state.urlValue, onChange: this.onChange.bind(this),
                                autoFocus: true, onKeyDown: this._onLinkInputKeyDown.bind(this) })
                        )
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "drafts-dialog-box-footer" },
                        _react2.default.createElement(
                            "a",
                            { className: "btn-floating btn-small grey", onClick: this.props.onDismiss },
                            _react2.default.createElement(
                                "i",
                                {
                                    className: "material-icons left" },
                                "clear"
                            )
                        ),
                        _react2.default.createElement(
                            "a",
                            { className: "btn-floating btn-small grey", onClick: this.submitChanges.bind(this) },
                            _react2.default.createElement(
                                "i",
                                {
                                    className: "material-icons left" },
                                "check"
                            )
                        )
                    )
                ),
                _react2.default.createElement("div", { className: "drafts-dialog-overlay", onClick: this.props.onDismiss })
            );
        }
    }]);

    return DraftDialogBox_789789;
}(_react.Component);

exports.default = DraftDialogBox_789789;