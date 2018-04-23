/*
 * Copyright (c) 2018
 */

import React, { Component } from "react";
import './RichTextWidget.scss';

import diamondImg from './diamond.png';

export default class RichTextWidget extends Component {

    render() {
        const {xml} = this.props;
        return (
            <div className="richText">
                {XmlToSynthetic(xml)}
            </div>
        );
    }
}

/**
 * Recursively walks XML DOM and returns an equivalent synthetic DOM.
 */
function XmlToSynthetic(xml, scale=1.0, defaultStyle={}) {
    let syntheticElement = null;

    if (xml) {
        const {syntheticStyle, className, syntheticTagName} = XmlTagAndAttributeToReactTagAndStyle(xml);

        let children = [];
        for (let xmlChild of xml.children) {
            children.push(XmlToSynthetic(xmlChild));
        }

        const childContent = children.length ? children : xml.textContent;
        syntheticElement  = React.createElement(syntheticTagName, {className, style: syntheticStyle }, childContent );
    }

    return syntheticElement ;
}

function XmlTagAndAttributeToReactTagAndStyle(xml) {
    if (xml == null) {
        return null;
    }

    const syntheticTagName = GetTagNameFromXmlTagName(xml.nodeName);
    const className = '';
    const syntheticStyle = GetReactStyleFromXmlAttributes(xml.attributes);

    return {syntheticStyle, className, syntheticTagName}
}

/**
 * @return {string}
 * @return {string}
 */
function GetTagNameFromXmlTagName(xmlTagName) {
    let syntheticTagName = '';

    switch(xmlTagName) {
        case 'richText':
            syntheticTagName = 'div';
            break;
        case 'TextFlow':
            syntheticTagName = 'div';
            break;
        case 'list':
            syntheticTagName = 'ul';
            break;
        case '#document':
            syntheticTagName = 'div';
            break;
        default:
            syntheticTagName = xmlTagName;
            break;
    }
    return syntheticTagName;
}

function GetReactStyleFromXmlAttributes(xmlAttributes) {
    let syntheticStyle = {};

    if (xmlAttributes != null) {
        const fontStyle = GenerateFontStyle(xmlAttributes);
        const textAlignStyle = GenerateTextAlignStyle(xmlAttributes);
        const whiteSpaceStyle = GenerateWhiteSpaceStyle(xmlAttributes);
        const colorStyle = GenerateColorStyle(xmlAttributes);
        const textDecoration = GenerateTextDecorationStyle(xmlAttributes);
        const listStyle = GenerateListStyle(xmlAttributes);

        syntheticStyle = {...fontStyle,
            ...textAlignStyle,
            ...whiteSpaceStyle,
            ...colorStyle,
            ...textDecoration,
            ...listStyle
        }
    }

    return syntheticStyle;
}

// Style Generate Functions

function GenerateFontStyle(xmlAttributes) {
    let syntheticStyle = {};

    if (xmlAttributes !== null) {
        // Check fontFamily Attribute
        if ('fontFamily' in xmlAttributes) {
            syntheticStyle = {...syntheticStyle, ...{fontFamily: xmlAttributes['fontFamily'].value}};
        }
        // Check fontSize Attribute
        if ('fontSize' in xmlAttributes) {
            syntheticStyle = {...syntheticStyle, ...{fontSize: parseFloat(xmlAttributes['fontSize'].value)}};
        }
        // Check textAlign attribute
        if ('fontWeight' in xmlAttributes) {
            syntheticStyle = {...syntheticStyle, ...{fontWeight: xmlAttributes['fontWeight'].value}};
        }
        // Check fontStyle Attribute
        if ('fontStyle' in xmlAttributes) {
            syntheticStyle = {...syntheticStyle, ...{fontStyle: xmlAttributes['fontStyle'].value}};
        }
    }

    return syntheticStyle;
}

function GenerateTextAlignStyle(xmlAttributes) {
    let syntheticStyle = {};

    if (xmlAttributes !== null) {
        // Check textAlign attribute
        if ('textAlign' in xmlAttributes) {
            syntheticStyle = {...syntheticStyle, ...{textAlign: xmlAttributes['textAlign'].value}};
        }
    }

    return syntheticStyle;
}

function GenerateWhiteSpaceStyle(xmlAttributes) {
    let syntheticStyle = {};

    if (xmlAttributes !== null) {
        // Check whiteSpaceCollapse attribute
        if ('whiteSpaceCollapse' in xmlAttributes) {
            if (xmlAttributes['whiteSpaceCollapse'].value == 'preserve') {
                syntheticStyle = {...syntheticStyle, ...{whiteSpace: 'normal'}};
            }
        }
    }

    return syntheticStyle;
}

function GenerateColorStyle(xmlAttributes) {
    let syntheticStyle = {};

    if (xmlAttributes !== null) {
        // Check color attritube
        if ('color' in xmlAttributes) {
            syntheticStyle = {...syntheticStyle, ...{color: xmlAttributes['color'].value}};
        }
    }

    return syntheticStyle;
}

function GenerateTextDecorationStyle(xmlAttributes) {
    let syntheticStyle = {};

    if (xmlAttributes !== null) {

        // Check text decoration attribute
        if ('textDecoration' in xmlAttributes) {
            syntheticStyle = {...syntheticStyle, ...{textDecoration: xmlAttributes['textDecoration'].value}};
        }
    }

    return syntheticStyle;
}

function GenerateListStyle(xmlAttributes) {
    let syntheticStyle = {};

    if (xmlAttributes !== null) {

        // Check list style decoration attribute
        if ('listStyleType' in xmlAttributes) {
            const listStyleType = xmlAttributes['listStyleType'].value;
            switch (listStyleType) {
                case 'diamond':
                    syntheticStyle = {...syntheticStyle, ...{listStyleImage: 'url('+diamondImg+')'}};
                    break;
                case 'upperAlpha':
                    syntheticStyle = {...syntheticStyle, ...{listStyleType: 'upper-alpha'}};
                    break;
                case 'upperRoman':
                    syntheticStyle = {...syntheticStyle, ...{listStyleType: 'upper-roman'}};
                    break;
                default:
                    syntheticStyle = {...syntheticStyle, ...{listStyleType: listStyleType}};
                    break;
            }
        }
    }

    return syntheticStyle;
}