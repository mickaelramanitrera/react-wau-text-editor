import React from 'react';
import linkifyIt from 'linkify-it';
import tlds from 'tlds';

/*Stylings*/
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

const FindNormalLinks = (contentBlock, callback, contentState) => {
    const linkify = linkifyIt();
    linkify.tlds(tlds);

    const links = linkify.match(contentBlock.get('text'));
    if (typeof links !== 'undefined' && links !== null) {
        links.map((link) => {
            callback(link.index, link.lastIndex);
        });
    }
};

const Link = (props) => {
    let url = props.contentState.getEntity(props.entityKey).getData();
    let urlVal = url;
    if(urlVal.includes('http:\/\/') === false){
        urlVal = 'http:\/\/' + url;
    }
    return (

        <a href={urlVal} style={styles.link} target="_blank">
            {props.children}
        </a>
    );
};

const NormalLink = (props) => {
    return (
        <a href={props.children} style={styles.link} target="_blank">
            {props.children}
        </a>
    );
};

const currentConfig = [
    {
        strategy : findLinkEntities,
        component: Link
    },
    {
        strategy : FindNormalLinks,
        component: NormalLink
    }
];

export default currentConfig;