import React from 'react';
import Select from 'react-select';

// Custom overrides for "code" style.
export const styleMap      = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily     : '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize       : 16,
        padding        : 2,
    },
};

/**
 * Component for buttons
 */
export class StyleButton extends React.Component {
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

/**
 *
 * Button types to render
 */
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
const INLINE_STYLES       = [
    {label: 'format_bold', style: 'BOLD'},
    {label: 'format_italic', style: 'ITALIC'},
    {label: 'format_underline', style: 'UNDERLINE'},
];


/**
 * Block buttons rendering
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
export const BlockStyleControls  = (props) => {
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

/**
 * Inline buttons rendering
 * @param props
 * @returns {XML}
 * @constructor
 */
export const InlineStyleControls = (props) => {
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