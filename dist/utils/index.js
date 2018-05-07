'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createNonEmptyParagraph = exports.getBlockStyle = exports._getEntityRange = exports._getCharacterAtEndOfSelection = exports._getEntityAtCaret = exports._replaceTxtNotInA = undefined;

var _draftJs = require('draft-js');

var _replaceTxtNotInA = exports._replaceTxtNotInA = function _replaceTxtNotInA(html, regex, replace) {

    //just to make the txt parse easily, without (start) or (ends) issue
    html = '>' + html + '<';

    //parse txt between > and < but not follow with</a
    html = html.replace(/>([^<>]+)(?!<\/a)</g, function (match, txt) {
        //now replace the txt
        return '>' + txt.replace(regex, replace) + '<';
    });
    //remove the head > and tail <
    return html.substring(1, html.length - 1);
};

var _getEntityAtCaret = exports._getEntityAtCaret = function _getEntityAtCaret(editorState) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var selection = editorState.getSelection();
    var anchorkey = selection.getAnchorKey();
    var contentState = editorState.getCurrentContent();
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
};

var _getCharacterAtEndOfSelection = exports._getCharacterAtEndOfSelection = function _getCharacterAtEndOfSelection(selection, contentState) {
    var currentContentBlockKey = selection.getAnchorKey();
    var currentContentBlock = contentState.getBlockForKey(currentContentBlockKey);
    var allTextInCurrentBlock = currentContentBlock.getText();
    //get the character at the end of selection
    return allTextInCurrentBlock[selection.getFocusOffset()];
};

var _getEntityRange = exports._getEntityRange = function _getEntityRange(entityToFind, contentBlock, contentState) {
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
};

var getBlockStyle = exports.getBlockStyle = function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return null;
    }
};

var createNonEmptyParagraph = exports.createNonEmptyParagraph = function createNonEmptyParagraph(content) {
    return content.replace(/<p><\/p>/g, "<p>&nbsp;</p>");
};