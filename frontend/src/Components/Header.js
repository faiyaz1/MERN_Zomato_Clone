import React from 'react';
import FacebookLogin from 'react-facebook-login';
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            loggedInUser: undefined
        }
    }

    responseFacebook = (response) => {
        this.setState({ loggedInUser: response.name, modalIsOpen: false });
        // axios call to save the user data in DB to sinUp a user
    }

    handleLogin = () => {
        this.setState({ modalIsOpen: true });
    }

    handleLogout = () => {
        this.setState({ loggedInUser: undefined })
    }

    responseGoogle = (response) => {
        this.setState({ loggedInUser: response.profileObj.name, modalIsOpen: false })
    }

    render() {
        const { modalIsOpen, loggedInUser } = this.state;
        return (
            <div>
                <div style={{ height: '50px', backgroundColor: 'red' }}>
                    {loggedInUser ? <div style={{ float: 'right', color: 'white', fontWeight: 'bold', margin: '15px' }}>{loggedInUser}
                        <div style={{ float: 'right', color: 'white', fontWeight: 'bold', paggingLeft: '15px' }} onClick={this.handleLogout}>LogOut</div></div> :
                        <div onClick={this.handleLogin} style={{ float: 'right', color: 'white', fontWeight: 'bold', margin: '15px' }}>Login</div>}
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <FacebookLogin
                            appId=""
                            textButton="Continue with Facebook"
                            size="metro"
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="btn-md fb"
                            icon="fa-facebook-square"
                        />
                        <div>
                            <GoogleLogin
                                clientId=""
                                buttonText="Continue with Gmail"
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Header;