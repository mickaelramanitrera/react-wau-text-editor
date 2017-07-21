'use strict';

import React from 'react';
import {
    Editor,
    EditorState,
    RichUtils,
    CompositeDecorator,
    SelectionState,
    Entity,
    convertFromHTML,
    ContentState
} from 'draft-js';
import Select from 'react-select';
import {stateToHTML} from 'draft-js-export-html';
import linkifyIt from 'linkify-it';
import tlds from 'tlds';

export default class RichEditor extends React.Component {
    constructor(props) {
        super(props);

        /*Decorators functions*/
        /**********************/
        const findLinkEntities = (contentBlock, callback, contentState) => {
            contentBlock.findEntityRanges(
                (character) => {
                    const entityKey = character.getEntity();
                    return (
                        entityKey !== null &&
                        contentState.getEntity(entityKey).getType() === 'LINK'
                    );
                },
                callback
            );
        };
        const Link             = (props) => {
            const {url} = props.contentState.getEntity(props.entityKey).getData();
            return (
                <a href={url} style={styles.link} target="_blank">
                    {props.children}
                </a>
            );
        };
        const FindNormalLinks  = (contentBlock, callback, contentState) => {
            const linkify = linkifyIt();
            linkify.tlds(tlds);

            const links = linkify.match(contentBlock.get('text'));
            if (typeof links !== 'undefined' && links !== null) {
                links.map((link) => {
                    callback(link.index, link.lastIndex);
                });
            }
        };
        const NormalLink       = (props) => {
            return (
                <a href={props.children} style={styles.link} target="_blank">
                    {props.children}
                </a>
            );
        };


        /*Decorator*/
        /**********************/
        const decorator = new CompositeDecorator([
            {
                strategy : findLinkEntities,
                component: Link,
            },
            {
                strategy : FindNormalLinks,
                component: NormalLink
            }
        ]);


        //affect the desired content from props
        var content = null;
        if (this.props.content === null || this.props.content !== "") {
            const blocksFromHtml = convertFromHTML(this.props.content);
            content              = ContentState.createFromBlockArray(
                blocksFromHtml.contentBlocks,
                blocksFromHtml.entityMap
            );
            content              = EditorState.createWithContent(content, decorator);
        } else {
            content = EditorState.createEmpty(decorator);
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
            this.props.onChange(stateToHTML(editorState.getCurrentContent()));
        }
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
        const entityAtCaret = this._getEntityAtCaret();
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
        const entityAtCaret        = this._getEntityAtCaret();
        var contentStateWithEntity = null;
        if (entityAtCaret !== null && entityAtCaret.getType() === "LINK") {
            //update the old link
            const entityKeyAtCaret = this._getEntityAtCaret(true);
            contentStateWithEntity = contentState.replaceEntityData(entityKeyAtCaret, {url: urlValue});

            this.setState({urlInputValue: "", showInput: false});
            this.focusEditor();
            return true;
        }

        //do not create link if caret selection is collapsed
        if (selection.isCollapsed() && contentStateWithEntity === null) {
            console.log("no selection");
            this.focusEditor();
            return false;
        }
        //create an entity
        contentStateWithEntity = contentState.createEntity(
            'LINK',
            'SEGMENTED',
            {url: urlValue}
        );
        const entityKey        = contentStateWithEntity.getLastCreatedEntityKey();
        //affect the link entity to the selection
        this.setState({
            editorState  : RichUtils.toggleLink(this.state.editorState, selection, entityKey),
            urlInputValue: "",
            showInput    : false
        });
        this.focusEditor();
        console.log('created link');
    }

    _getEntityAtCaret(key = false) {
        const selection           = this.state.editorState.getSelection();
        const anchorkey           = selection.getAnchorKey();
        const contentState        = this.state.editorState.getCurrentContent();
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
    }

    _getEntityRange(entityToFind, contentBlock, contentState) {
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
                    anchorKey: contentBlock.getKey(),
                    anchorOffset: start,
                    focusKey: contentBlock.getKey(),
                    focusOffset: end
                });
            }
        );

        return range;
    }

    removeLink() {
        const EditorState   = this.state.editorState;
        const entityAtCaret = this._getEntityAtCaret();
        const contentState  = EditorState.getCurrentContent();
        const contentBlock  = contentState.getBlockForKey(EditorState.getSelection().getAnchorKey());
        if (entityAtCaret !== null && entityAtCaret.type === "LINK") {
            //get the selection of the entity
            const entitySelection = this._getEntityRange(entityAtCaret, contentBlock, contentState);
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
        console.log(val);
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

        let input                       = (this.state.showInput) ? <DraftDialogBox_789789
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
                    />
                </div>
            </div>
        );
    }
}


class DraftDialogBox_789789 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            urlValue: props.value
        };
    }

    onChange(event) {
        this.setState({urlValue: event.target.value});
    }

    submitChanges() {
        this.props.onSubmit(this.state.urlValue);
    }

    _onLinkInputKeyDown(e) {
        if (e.which === 13) {
            this.submitChanges();
        }
    }

    render() {
        return (
            <div>
                <div className="drafts-dialog-box">
                    <div className="drafts-dialog-box-content">
                        <h5><i className="material-icons left">link</i>Add/Edit link</h5>
                        <p><input type="text" value={this.state.urlValue} onChange={this.onChange.bind(this)}
                                  autoFocus={true} onKeyDown={this._onLinkInputKeyDown.bind(this)}/></p>
                    </div>
                    <div className="drafts-dialog-box-footer">
                        <a className="btn-floating btn-small grey" onClick={this.props.onDismiss}><i
                            className="material-icons left">clear</i></a>
                        <a className="btn-floating btn-small grey" onClick={this.submitChanges.bind(this)}><i
                            className="material-icons left">check</i></a>
                    </div>
                </div>

                <div className="drafts-dialog-overlay" onClick={this.props.onDismiss}>
                </div>
            </div>
        );
    }
}

const styles = {
    root             : {
        fontFamily: '\'Georgia\', serif',
        padding   : 20,
        width     : 600,
    },
    buttons          : {
        marginBottom: 10,
    },
    urlInputContainer: {
        marginBottom: 10,
    },
    urlInput         : {
        fontFamily : '\'Georgia\', serif',
        marginRight: 10,
        padding    : 3,
    },
    editor           : {
        border   : '1px solid #ccc',
        cursor   : 'text',
        minHeight: 80,
        padding  : 10,
    },
    button           : {
        marginTop: 10,
        textAlign: 'center',
    },
    link             : {
        color         : '#3b5998',
        textDecoration: 'underline',
    },
};

// Custom overrides for "code" style.
const styleMap      = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily     : '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize       : 16,
        padding        : 2,
    },
};
const getBlockStyle = (block) => {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return null;
    }
};


class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }
        return (
            <a className={className} onMouseDown={this.onToggle}>
                <i className="material-icons">{this.props.label}</i>
            </a>
        );
    }
}
const BLOCK_TYPES = [
    {label: 'format_quote', style: 'blockquote'},
    {label: 'format_list_bulleted', style: 'unordered-list-item'},
    {label: 'format_list_numbered', style: 'ordered-list-item'},
    {label: 'code', style: 'code-block'},
];
const H_STYLES    = [
    {label: "Normal", value: 'unstyled'},
    {label: 'H1', value: 'header-one'},
    {label: 'H2', value: 'header-two'},
    {label: 'H3', value: 'header-three'},
    {label: 'H4', value: 'header-four'},
    {label: 'H5', value: 'header-five'},
    {label: 'H6', value: 'header-six'}
];


const BlockStyleControls  = (props) => {
    const {editorState} = props;
    const selection     = editorState.getSelection();
    const blockType     = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <div className="RichEditor-controls">
            <Select
                value={props.h_styleValue}
                options={H_STYLES}
                onChange={props.h_styleChanged}
                clearable={false}
            />
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};
const INLINE_STYLES       = [
    {label: 'format_bold', style: 'BOLD'},
    {label: 'format_italic', style: 'ITALIC'},
    {label: 'format_underline', style: 'UNDERLINE'},
    {label: 'text_format', style: 'CODE'},
];
const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};
