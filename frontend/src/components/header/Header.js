import React from 'react';
import styles from './Header.scss'
import {Link} from 'react-router-dom'

const logo =(<div className={styles.logo}>
    <Link to="/">
    <h2>
        Shop<span>Ecomm</span>
    </h2>
    </Link>

</div>
)

const Header = () => {
  return (
    <header >
      Header
      <div className={styles.header}>
       {logo}
      </div>
    </header>
  );
}

export default Header;
