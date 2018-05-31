'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _linkifyIt = require('linkify-it');

var _linkifyIt2 = _interopRequireDefault(_linkifyIt);

var _tlds = require('tlds');

var _tlds2 = _interopRequireDefault(_tlds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*Stylings*/
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

var findLinkEntities = function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function (character) {
        var entityKey = character.getEntity();
        return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
    }, callback);
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

var Link = function Link(props) {
    var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
        url = _props$contentState$g.url;

    return _react2.default.createElement(
        'a',
        { href: url, style: styles.link, target: '_blank' },
        props.children
    );
};

var NormalLink = function NormalLink(props) {
    return _react2.default.createElement(
        'a',
        { href: props.children, style: styles.link, target: '_blank' },
        props.children
    );
};

var currentConfig = [{
    strategy: findLinkEntities,
    component: Link
}, {
    strategy: FindNormalLinks,
    component: NormalLink
}];

exports.default = currentConfig;