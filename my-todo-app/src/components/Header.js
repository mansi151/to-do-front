import React from 'react';
class Header extends React.Component {
    render(){
        const {title} = this.props;
        return (
            <header style={styles.header}>
            <h1>{title}</h1>
            </header>
        )
    }
}
const styles = {
    header :{
        backgroundColor: 'lightpink',
        padding:'3px',
        textAlign:'center',
    }
}
export default Header;