import React from 'react';
import styles from './header.css'
import {Link, NavLink} from 'react-router-dom'
import { FaCartArrowDown } from "react-icons/fa";
const logo =(<div className="logo">
    <Link to="/">
    <h2 className='h2'>
        Founder`s<span className='span'>Box</span>
    </h2>
    </Link>

</div>
)
const activeLink = ({isActive}) => (
    isActive ? `${styles.active}` : ""
  );
  
const Header = () => {
    const cart =(
        <span className='cart'>
<Link to='/cart'>Cart
<FaCartArrowDown size={20}/>
<p></p>
</Link>
        </span>
    )
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

            <span >
                <NavLink to={'login'} className={activeLink}>
                Login</NavLink>

                <NavLink to={'register'} className={activeLink}>
                Register</NavLink>

                <NavLink to={'order-history'} className={activeLink}>
                My Orders</NavLink>


            </span>
{cart}
        </div>
       </nav>
      </div>
    </header>
  );
}

export default Header;
