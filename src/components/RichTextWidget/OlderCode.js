/*
 * Copyright (c) 2018
 */
import React from "react";
import {opacityStyleOf, positionStyleOf, shapeStyleOf} from "components/publication/widgets/WidgetRenderer";

const _DEBUG = false;


export default function(props) {

    const divStyle = {
        ...opacityStyleOf(props),
        ...positionStyleOf(props),
        ...shapeStyleOf(props)
    };
    const {element, index, scale} = props;
    let {size} = element;
    const innerHtml = {
        __html: createMarkup(element.richText, scale)
    };
    // TODO: padding, inner div w/ spanStyle.
    // The className below is for diagnostic purposes only.
    return <div className="richtext" dangerouslySetInnerHTML={innerHtml} key={index} style={divStyle} />
}

/**
 * @private
 */
function createMarkup(richText, scale) {
    try {
        if (!richText || richText.nodeName != "TextFlow") {
            throw new Error("<TextFlow> expected");
        }
        const taggedMarkup = changeTagName(richText, 'div');
        const markup = convertTextFlow(taggedMarkup);
        const convertedMarkup = listConverter(markup);
        const scaledMarkup = scaleConvertedMarkup(convertedMarkup, scale); // TODO: why scale again?  See convertTextFlow().

        return scaledMarkup;
    } catch (e) {
        return e.message;
    }
}

//create a new div to build the html dom from the textflow xml
function changeTagName(selector,tagname) {
    var originalElement = selector;
    var newElement = document.createElement(tagname);
    //Create new element with desired tagname
    for (let i=0; i < selector.children.length; i++) {
        let newChild = selector.children[i];
        let newNode = selector.children[i].cloneNode(true);
        newElement.appendChild(newNode);

        //remove empty p tags
        if (newNode.tagName == "p" && newChild.nextElementSibling != null) {
            if (newChild.nextElementSibling.tagName == "list") {
                newNode.setAttribute("style", "margin: 0px")
                _DEBUG && console.log(newNode)
            }
            if (isEmptyParagraph(newNode)) {
                newElement.removeChild(newNode);
            }
        }
    }
    let styleAttr;
    //if the original element already has a style attribute, it has already been converted
    if (originalElement.hasAttribute("style"))  {
        styleAttr = originalElement.getAttribute("style")
    } else {
        let convertedStyle = convertElementAttributes(originalElement);
        styleAttr = convertedStyle.getAttribute("style")
    }
    //Populate attributes object
    newElement.setAttribute("style", styleAttr);
    //Assign attributes from old element to new element
    return newElement;
}

function convertElementAttributes(element) {
        let textFlowConverter = new TextFlowConverter();
        let styleField = [],
            textflowAttrs = [];

        // Loop through all attributes.
        for (let n in element.attributes) {
            const attr = element.attributes[n];
            if (attr.specified) {
                textflowAttrs.push(attr.name);
                styleField.push(textFlowConverter.attrConverter(attr));
            }
        };

        for (let i = 0, n = textflowAttrs.length; i < n; i++) {
            element.removeAttribute(textflowAttrs[i]); // TODO: WTF!  This modifies the XML!
        }

        // Apply the 'style' html attribute.
        if (textflowAttrs.length > 0) {
            element.setAttribute('style', styleField.join(';'));
        }

            //set the paragraph spacing according to scale
        if (element.tagName == "p") {
            element.setAttribute("style", "padding-bottom: 0px; padding-right:0px")
        }

        return element;
}

function convertTextFlow(element) {
    let newText = '';
    let converted = element;
    let all = converted.getElementsByTagName('*');
    let allArray = Array.from(all);
    //start recursing children if selected element has children
    for (let i = 0; i < allArray.length; i++) {
        let child = allArray[i]
        let parent = child.parentNode;
        let newEl;
        if(child.hasAttribute("listStyleType")) {
            newEl = child.cloneNode(true);
        } else {
            newEl = convertElementAttributes(child);
        }
        parent.replaceChild(newEl, child);
    }

    newText = converted;
    return newText;
}

function isEmptyParagraph(child) {
    if (child.firstElementChild != null && child.firstElementChild.tagName == "span") {
        if (child.firstElementChild.textContent.length == 0
                || child.firstElementChild.innerHTML == "&nbsp;"
                || child.firstElementChild.innerHTML == ""
                || child.firstElementChild.innerHTML == " ") {
            return true;
        }
    }
    return false;
}

class TextFlowConverter {
    constructor() {

        this.attrConversion = {
            'textAlign': ['text-align','',''], // Style name, Value preffix, Value Suffix
            'color': ['color','',''],
            'fontFamily': ['font-family','',''],
            'fontSize': ['font-size','','px'],
            'fontStyle': ['font-style','',''],
            'fontWeight': ['font-weight','',''],
            'class': ['className','',''],
            'id': ['id','',''],
        };
        this.attrConverter = this.attrConverter.bind(this);
    }

    attrConverter(textflowAttr) {
        var attr = this.attrConversion[textflowAttr.name];
        if (attr != undefined) {
            return attr[0] + ':' + attr[1] + textflowAttr.value + attr[2];
        }
    }
}

//convert list tags to html list
export function listConverter(markup) {
    let newMarkup, content, listStyleType, childrenCollection,
        styleAttr, newStyleAttr, newContent, child,
        children, newElement;
    let listEl = 'ul';
    let classAttr = '';
    const listCollection = markup.getElementsByTagName('list');
    const lists = Array.from(listCollection);
    if(lists.length > 0) {
        for (let i = 0, n = lists.length; i < n; i++) {
            styleAttr = lists[i].getAttribute("listStyleType");

            if (styleAttr == 'disc') { newStyleAttr = 'disc'; listEl = 'ul'; }
            //we must set the class to square for square lists because setting list-style-type to square inline does not work
            //so it must be done as a css rule
            else if (styleAttr == 'square') { newStyleAttr = 'square'; classAttr= 'square'; listEl = 'ul'; }
            else if (styleAttr == 'circle') { newStyleAttr = 'circle'; listEl = 'ul'; }
            else if (styleAttr == 'diamond') { newStyleAttr = 'none'; classAttr= 'diamond'; listEl = 'ul';}
            else if (styleAttr == 'decimal') { newStyleAttr = 'decimal'; listEl = 'ul'; }
            else if (styleAttr == 'upperAlpha') { newStyleAttr = 'upper-alpha'; listEl = 'ol'; }
            else if (styleAttr == 'lowerAlpha') { newStyleAttr = 'lower-alpha'; listEl = 'ol'; }
            else if (styleAttr == 'upperRoman') { newStyleAttr = 'upper-roman'; listEl = 'ol'; }
            else if (styleAttr == 'lowerRoman') { newStyleAttr = 'lower-roman'; listEl = 'ol';  }
            childrenCollection = lists[i].children;
            children = Array.from(childrenCollection);
            newElement = document.createElement(listEl);

            for(let i=0; i < children.length; i++) {
                //must use cloneNode method to append child otherwise it will not work properly
                let newNode = children[i].cloneNode(true);
                newElement.appendChild(newNode)
            }
            newElement.setAttribute("list-style-type", newStyleAttr);
            //set the styles on the list element
            newElement.setAttribute("style", _LIST_STYLES.list)
            //if the list is diamond, then add the diamond class defined in index.html so it will show the diamond character
            if (classAttr.length > 0)
                newElement.setAttribute("class", classAttr)

            let paragraphs = newElement.getElementsByTagName("p");
            let pArray = Array.from(paragraphs);
            for (let i=0; i < paragraphs.length; i++) {
                let pTag = paragraphs[i];
                //we need to 0 out the margin and padding on p tags that are used as list items
                pTag.setAttribute("style", _LIST_STYLES.paragraph)
            }
            markup.replaceChild(newElement, lists[i])
        }
    }
    return markup;
}

function scaleText(value, scaleFactor) {
    let newSize = Math.round(parseInt(value) * scaleFactor);
    return newSize;
}

//scale the font sizes according to window scale factor
function scaleConvertedMarkup(markup, scaleFactor) {
    let scaledText = '';
    if (markup.hasAttribute("style")) {
        let divStyle = markup.getAttribute("style");
        if (divStyle.includes("font-size")) {
            let position = divStyle.indexOf("px") - 2
            let divFont = divStyle.substring(position, position + 2);
            let pos =  divStyle.charAt(position);
            if (isNaN(divStyle.charAt(position))) {
                position = divStyle.indexOf("px") - 1
                divFont = divStyle.substring(position, position + 1);
            }
            let newFontSize = scaleText(divFont,scaleFactor);
            let newDivStyle= divStyle.replace(divFont, newFontSize);
            markup.setAttribute("style", newDivStyle)
        }
    }
    let elements = markup.getElementsByTagName('*');
    if (elements.length > 0) {
        let elArray = Array.from(elements);
        for (let el of elArray) {
            if (el.hasAttribute("style")) {
                let elStyle = el.getAttribute("style");
                if (elStyle.includes("font-size")) {
                    let position = elStyle.indexOf("px") - 2
                    let elFont = elStyle.substring(position, position + 2);
                    if (isNaN(elStyle.charAt(position))) {
                        position = elStyle.indexOf("px") - 1
                        elFont = elStyle.substring(position, position + 1);
                    }
                    let newElSize = scaleText(elFont, scaleFactor);
                    let newElStyle = elStyle.replace(elFont, newElSize);
                    el.setAttribute("style", newElStyle)
                }
            }
        }
    }
   //the final markup needs to be passed as raw html
    return markup.outerHTML;
}

function paragraphPadding(scaleFactor) {
   let scaled = 20 * scaleFactor;
  // return scaled;
   return `padding-top: ${scaled}; padding-bottom: ${scaled}`;
}

//styles for lists to address difference in list behavior between flash and html
//Note that these must be added as a string when using setAttribute method on raw html
const _LIST_STYLES = {
    paragraph:  "line-height: 1.0; margin: 0; padding: 0; text-indent: 0;",
    list: "padding-left: 20px; padding-right: 0; padding-top: 0; padding-bottom: 0; margin: 0;"
 }
