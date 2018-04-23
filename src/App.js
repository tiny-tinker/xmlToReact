import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import RichTextWidget from './components/RichTextWidget/RichTextWidget';
import xmlDecimal from './HubRichTextData-ListStyle-decimal.xml';
import xmlDiamond from './HubRichTextData-ListStyle-diamond.xml';
import xmlDisc from './HubRichTextData-ListStyle-disc.xml';
import xmlSquare from './HubRichTextData-ListStyle-square.xml';
import xmlUpperAlpha from './HubRichTextData-ListStyle-upperalpha.xml';
import xmlUpperRoman from './HubRichTextData-ListStyle-upperRoman.xml';
import xmlUpperPage02 from './HubRichTextData-Page02.xml';
import xmlUpperPage10 from './HubRichTextData-Page10.xml';
import xmlUpperPage15 from './HubRichTextData-Page15.xml';


class App extends Component {
  render() {
    const xmlDataListStyleDecimal   = new DOMParser().parseFromString(xmlDecimal, 'application/xml');
    const xmlDataListStyleDiamond   = new DOMParser().parseFromString(xmlDiamond, 'application/xml');
    const xmlDataListStyleDisc      = new DOMParser().parseFromString(xmlDisc, 'application/xml');
    const xmlDataListStyleSquare    = new DOMParser().parseFromString(xmlSquare, 'application/xml');
    const xmlDataUpperAlpha         = new DOMParser().parseFromString(xmlUpperAlpha, 'application/xml');
    const xmlDataUpperRoman         = new DOMParser().parseFromString(xmlUpperRoman, 'application/xml');
    const xmlDataPage02             = new DOMParser().parseFromString(xmlUpperPage02, 'application/xml');
    const xmlDataPage10             = new DOMParser().parseFromString(xmlUpperPage10, 'application/xml');
    const xmlDataPage15             = new DOMParser().parseFromString(xmlUpperPage15, 'application/xml');

    return (
      <div className="App">
        <RichTextWidget xml={xmlDataListStyleDecimal} scale={0.5} index={1}/>
        <br/>
        <RichTextWidget xml={xmlDataListStyleDiamond} scale={0.5} index={1}/>
        <br/>
        <RichTextWidget xml={xmlDataListStyleDisc} scale={0.5} index={1}/>
        <br/>
        <RichTextWidget xml={xmlDataListStyleSquare} scale={0.5} index={1}/>
        <br/>
        <RichTextWidget xml={xmlDataUpperAlpha} scale={0.5} index={1}/>
        <br/>
        <RichTextWidget xml={xmlDataUpperRoman} scale={0.5} index={1}/>
        <br/>
        <RichTextWidget xml={xmlDataPage02} scale={0.5} index={1}/>
        <br/>
        <RichTextWidget xml={xmlDataPage10} scale={0.5} index={1}/>
        <br/>
        <RichTextWidget xml={xmlDataPage15} scale={0.5} index={1}/>
      </div>
    );
  }
}

export default App;
