//var Footer = require('Footer');
import React from 'react';
import Navigation from 'Navigation';
import Footer from 'Footer';

var Main = (props) => {
  return (
    <div>
      <Navigation/>
      <div>
        {props.children}
      </div>
    </div>
  );
};

export default Main;