import { Typography } from '@material-ui/core';
import logo from '../images/logo.png';

const AppHeader = ({ flagCounter }) => {

    return (
        <header>
            <div className='leftTop'>
                <img src={logo} alt='Logo' width="50px" height="50px" />
            </div>
            <div className='leftTop'>
                <h1>MINESWEEPER</h1>
            </div>
            <div className="rightTop">
                <Typography variant="h4">Mines: {flagCounter}</Typography>
            </div>
        </header>
    )

}

export default AppHeader;