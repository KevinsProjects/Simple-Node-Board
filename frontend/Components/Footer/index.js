import React, { Component } from 'react';
import classnames from 'classnames';

import styles from './styles';
import appLayout from 'SharedStyles/appLayout.css';

class Footer extends Component {
  render() {
    return (
      <div className={classnames(appLayout.constraintWidth, styles.contentArea)}>
        
      </div>
    );
  }
}


Footer.defaultProps = {
};

Footer.propTypes = {
};

export default Footer;
