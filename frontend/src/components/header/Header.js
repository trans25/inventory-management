import React from 'react';
import styles from './header.css'
import {Link, NavLink} from 'react-router-dom'

const logo =(<div className="logo">
    <Link to="/">
    <h2 className='h2'>
        Shop<span className='span'>Ecomm</span>
    </h2>
    </Link>

</div>
)
const activeLink = ({isActive}) => (
    isActive ? `${styles.active}` : ""
  );
  
const Header = () => {
  return (
    <header >
      
      <div className="header">
       {logo}
       <nav>
        <ul>
<li>
    <NavLink to="/shop" className={activeLink}>Shop</NavLink>

</li>
        </ul>
        <div className={styles['header-right']}>

            <span className={styles.links}>
                <NavLink to={'login'} className={activeLink}>
                Login</NavLink>

                <NavLink to={'register'} className={activeLink}>
                Register</NavLink>

                <NavLink to={'order-history'} className={activeLink}>
                My Orders</NavLink>


            </span>

        </div>
       </nav>
      </div>
    </header>
  );
}

export default Header;
