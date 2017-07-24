'use strict';

import React from 'react';
import {
    Editor,
    EditorState,
    RichUtils,
    CompositeDecorator,
    Entity,
    convertFromHTML,
    convertToRaw,
    ContentState,
    Modifier
} from 'draft-js';
import stateToHTML from './Converter/draftjs-to-html';
import {stateFromHTML} from 'draft-js-import-html';
import decorator from './Decorators';
import LinkDialog from './DialogBoxes/Link';
import {
    BlockStyleControls,
    InlineStyleControls,
    styleMap
} from './Controls/StandardControls';
import {
    _replaceTxtNotInA,
    _getEntityRange,
    _getEntityAtCaret,
    getBlockStyle,
    _getCharacterAtEndOfSelection
} from './utils';


export default class RichEditor extends React.Component {
    constructor(props) {
        super(props);

        //affect the desired content from props
        var content = null;
        if (this.props.content === null || this.props.content !== "") {
            const importfromhtml = stateFromHTML(this.props.content);
            content              = EditorState.createWithContent(importfromhtml, new CompositeDecorator(decorator));
        } else {
            content = EditorState.createEmpty(new CompositeDecorator(decorator));
        }

        this.state             = {editorState: content, urlInputValue: "", showInput: false, h_styleValue: 'unstyled'};
        this.focus             = () => this.refs.editor.focus();
        this.onChange          = (editorState) => this._handleChange(editorState);
        this.handleKeyCommand  = (command) => this._handleKeyCommand(command);
        this.onTab             = (e) => this._onTab(e);
        this.toggleBlockType   = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    }


    _handleChange(editorState) {
        //verify block styling here
        const Selection = editorState.getSelection();
        const BlockType = editorState
            .getCurrentContent()
            .getBlockForKey(Selection.getAnchorKey())
            .getType();
        this.setState({editorState: editorState, h_styleValue: BlockType});
        if (typeof this.props.onChange === 'function') {
            if (editorState.getCurrentContent().hasText()) {
                //replace the remaining links to anchors
                const textInHtml = stateToHTML(convertToRaw(editorState.getCurrentContent()));
                this.props.onChange(this._convertUrlsToHtmlLinks(textInHtml));
            } else {
                this.props.onChange("");
            }
        }
    }

    _convertUrlsToHtmlLinks(text) {
        const regx = /((https?:\/\/)?(www.)?[\w]+\.[^\s\<\>\"\']+)/g;
        return _replaceTxtNotInA(text, regx, "<a href='$1' target='_blank'>$1</a>");
    }

    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState      = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    focusEditor() {
        document.body.style.overflow = "auto";
        const self                   = this;
        setTimeout(function () {
            self.focus();
        }, 300);
    }

    promptForLink() {
        const contentState  = this.state.editorState.getCurrentContent();
        const selection     = this.state.editorState.getSelection();
        var linkValue       = "";
        //check if there is an entity link now
        const entityAtCaret = _getEntityAtCaret(this.state.editorState);
        if (entityAtCaret !== null && entityAtCaret.type === "LINK") {
            linkValue = entityAtCaret.getData().url;
        }
        if (linkValue === "" && selection.isCollapsed()) {
            this.focusEditor();
            return false;
        }
        //set body style
        document.body.style.overflow = "hidden";
        this.setState({urlInputValue: linkValue, showInput: true});
    }

    confirmLink(urlValue) {
        //do nothing if link is empty
        if (urlValue === "") {
            this.focusEditor();
            return false;
        }

        const contentState = this.state.editorState.getCurrentContent();
        const selection    = this.state.editorState.getSelection();

        //check if it is already a link there
        const entityAtCaret        = _getEntityAtCaret(this.state.editorState);
        var contentStateWithEntity = null;
        if (entityAtCaret !== null && entityAtCaret.getType() === "LINK") {
            //update the old link
            const entityKeyAtCaret = _getEntityAtCaret(this.state.editorState, true);
            contentStateWithEntity = contentState.replaceEntityData(entityKeyAtCaret, {url: urlValue});

            this.setState({urlInputValue: "", showInput: false});
            this.focusEditor();
            return true;
        }

        //do not create link if caret selection is collapsed
        if (selection.isCollapsed() && contentStateWithEntity === null) {
            this.focusEditor();
            return false;
        }
        //create an entity
        contentStateWithEntity = contentState.createEntity(
            'LINK',
            'MUTABLE',
            {url: urlValue, target:'_blank'}
        );
        const entityKey        = contentStateWithEntity.getLastCreatedEntityKey();
        //affect the link entity to the selection
        var withLink = Modifier.applyEntity(
            this.state.editorState.getCurrentContent(),
            selection,
            entityKey,
        );

        var editorStateWithEntity = EditorState.push(
            this.state.editorState,
            withLink,
            'apply-entity',
        );


        const characterAtEndOfSelection = _getCharacterAtEndOfSelection(selection, withLink);
        // insert a blank space after link if character after selection is empty
        if (characterAtEndOfSelection === undefined) {

            const collapsedSelection = editorStateWithEntity.getSelection().merge({
                anchorOffset: selection.get('focusOffset'),
                focusOffset: selection.get('focusOffset'),
            });
            editorStateWithEntity = EditorState.acceptSelection(editorStateWithEntity, collapsedSelection);
            withLink = Modifier.insertText(
                editorStateWithEntity.getCurrentContent(),
                collapsedSelection,
                ' ',
                editorStateWithEntity.getCurrentInlineStyle(),
                undefined,
            );
            editorStateWithEntity = EditorState.push(
                editorStateWithEntity,
                withLink,
                'insert-characters',
            );
        }

        this.setState({
            editorState  : editorStateWithEntity,
            urlInputValue: "",
            showInput    : false
        });
        this.focusEditor();
    }


    removeLink() {
        const EditorState   = this.state.editorState;
        const entityAtCaret = _getEntityAtCaret(this.state.editorState);
        const contentState  = EditorState.getCurrentContent();
        const contentBlock  = contentState.getBlockForKey(EditorState.getSelection().getAnchorKey());
        if (entityAtCaret !== null && entityAtCaret.type === "LINK") {
            //get the selection of the entity
            const entitySelection = _getEntityRange(entityAtCaret, contentBlock, contentState);
            this.setState({
                editorState  : RichUtils.toggleLink(EditorState, entitySelection, null),
                urlInputValue: "",
                showInput    : false
            });
        }
        this.focusEditor();
    }


    cancelUrlInput() {
        var newState       = Object.assign({}, this.state);
        newState.showInput = false;
        this.setState(newState);
        this.focusEditor();
    }

    h_styleChanged(val) {
        this.setState({
            editorState : RichUtils.toggleBlockType(
                this.state.editorState,
                val.value
            ),
            h_styleValue: val.value
        });
        this.focusEditor();
    }


    render() {

        const {editorState} = this.state;
        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className    = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        let input                       = (this.state.showInput) ? <LinkDialog
            value={this.state.urlInputValue}
            onSubmit={(urlValue) => this.confirmLink(urlValue)}
            onDismiss={this.cancelUrlInput.bind(this)}
        /> : null;
        const specialStyleForRemoveLink = {
            position: "absolute",
            top     : "1px",
            fontSize: "14px"
        };
        return (
            <div className="RichEditor-root">
                <div className="RichEditor-toolbar">
                    <BlockStyleControls
                        editorState={editorState}
                        onToggle={this.toggleBlockType}
                        h_styleChanged={this.h_styleChanged.bind(this)}
                        h_styleValue={this.state.h_styleValue}
                    />
                    <InlineStyleControls
                        editorState={editorState}
                        onToggle={this.toggleInlineStyle}
                    />
                    <div className="RichEditor-controls">
                        <a className="RichEditor-styleButton" onClick={this.promptForLink.bind(this)}>
                            <i className="material-icons">insert_link</i>
                        </a>
                        <a className="RichEditor-styleButton" onClick={this.removeLink.bind(this)}>
                            <i className="material-icons" style={specialStyleForRemoveLink}>remove_circle</i>
                            <i className="material-icons">insert_link</i>
                        </a>
                    </div>
                    {input}
                </div>
                <div className={className} onClick={this.focus}>
                    <Editor
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        onChange={this.onChange}
                        onTab={this.onTab}
                        ref="editor"
                        spellCheck={true}
                        decorators={decorator}
                    />
                </div>
            </div>
        );
    }
}