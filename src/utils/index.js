import {SelectionState} from 'draft-js';


export const _replaceTxtNotInA = (html, regexp) => {

  //just to make the txt parse easily, without (start) or (ends) issue
  html = '>' + html + '<';

  //parse txt between > and < but not follow with</a
  html = html.replace(/>([^<>]+)(?!<\/a)</g, function (match, txt) {
    //now replace the txt
    var matches = txt.match(regexp);
    if((matches !== null) && (matches.length > 0)){
      // Add http:// to link that does not have it or only add <a> balise
      matches.forEach(function(match){
        if (match.includes('http') !== true ){
          txt = txt.replace( new RegExp("\\b(?<!https?:\/\/|(\>)])"+ match.replace(/\./, "\\.") +"\\b"), "<a href='"+ "http:\/\/" + match +"' target='_blank'>" +  match +"</a>");
        } else {
          txt = txt.replace( new RegExp("\\b(?<!https?:\/\/|(\>)])"+ match.replace(/\./, "\\.") +"\\b"), "<a href='" + match + "' target='_blank'>"+ match +"</a>");
        }
      });
    }
    return '>' + txt + '<';
  });
  //remove the head > and tail <
  return html.substring(1, html.length - 1);
};

export const _getEntityAtCaret = (editorState, key = false) => {
    const selection           = editorState.getSelection();
    const anchorkey           = selection.getAnchorKey();
    const contentState        = editorState.getCurrentContent();
    var currentBlockOfContent = contentState.getBlockForKey(anchorkey);
    var anchorCurrentPosition = selection.getAnchorOffset();
    //check if the selection is a link
    var entityIdAtSelection   = currentBlockOfContent.getEntityAt(anchorCurrentPosition);
    if (entityIdAtSelection !== null) {
        if (key) {
            return entityIdAtSelection;
        } else {
            return contentState.getEntity(entityIdAtSelection);
        }
    }

    return null;
};

export const _getCharacterAtEndOfSelection = (selection, contentState) => {
    const currentContentBlockKey = selection.getAnchorKey();
    const currentContentBlock = contentState.getBlockForKey(currentContentBlockKey);
    const allTextInCurrentBlock = currentContentBlock.getText();
    //get the character at the end of selection
    return allTextInCurrentBlock[selection.getFocusOffset()];
};

export const _getEntityRange = (entityToFind, contentBlock, contentState) => {
    var range = null;
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            if (entityKey === null) {
                return false;
            }

            var entity = contentState.getEntity(entityKey);
            return (
                entityToFind === entity
            );
        },
        (start, end) => {
            range = new SelectionState({
                anchorKey   : contentBlock.getKey(),
                anchorOffset: start,
                focusKey    : contentBlock.getKey(),
                focusOffset : end
            });
        }
    );

    return range;
};

export const getBlockStyle = (block) => {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return null;
    }
};

export const createNonEmptyParagraph = (content) => {
  return content.replace(/<p><\/p>/g, "<p>&nbsp;</p>");
};