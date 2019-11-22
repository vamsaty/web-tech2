import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// import classes from './Auth.css';
import * as actions from '../../store/actions/index';

import { withStyles } from '@material-ui/styles';
// import axios from "axios";
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import Spinner from '../../../components/UI/Spinner/Spinner';

const styles = theme => ({
  button: {
      margin: 'theme.spacing(1)',
      fontFamily:'Quicksand',
      fontWeight:'bold'
  },
  container: {
    display: 'flex-block',
    flexWrap: 'wrap',
    padding:40,
  },
  textField: {
    width: 300,
  },
  modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  },

});


class Auth extends Component {
    state = {
        controls: {
            username: {
                elementType: 'input',
                elementConfig: {
                    type: 'username',
                    placeholder: 'Username'
                },
                value: '',
                validation: {
                    required: true,
                    isUsername: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        open: true,
        close: false,
        isSignup: true,

    }
    
    handleOpen = () =>{
        this.setState({
            open:1
        }) 
    }

    handleClose = () =>{
        this.setState({
            open:0
        }) 
        this.props.history.push(`/`)
    }

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }

    checkValidity ( value, rules ) {
        let isValid = true;
        if ( !rules ) {
            return true;
        }

        if ( rules.required ) {
            isValid = value.trim() !== '' && isValid;
        }

        if ( rules.minLength ) {
            isValid = value.length >= rules.minLength && isValid
        }

        if ( rules.maxLength ) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if ( rules.isEmail ) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test( value ) && isValid
        }

        if ( rules.isNumeric ) {
            const pattern = /^\d+$/;
            isValid = pattern.test( value ) && isValid
        }

        return isValid;
    }

    inputChangedHandler = ( event, controlName ) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity( event.target.value, this.state.controls[controlName].validation ),
                touched: true
            }
        };
        this.setState( { controls: updatedControls } );
    }

    submitHandler = ( event ) => {
        event.preventDefault();
        this.props.onAuth( this.state.controls.username.value, this.state.controls.password.value, this.state.isSignup );
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignup: !prevState.isSignup};
        });
    }

    render () {

        const { classes } = this.props;


        const formElementsArray = [];
        for ( let key in this.state.controls ) {
            formElementsArray.push( {
                id: key,
                config: this.state.controls[key]
            } );
        }
        
        

        let form = formElementsArray.map( formElement => (
            <>
            <TextField
                required
                key={formElement.id}
                label = {formElement.config.elementConfig.placeholder}
                type={formElement.config.elementConfig.type}
                // name={formElement.config.elementConfig}
                value={formElement.config.value}
                className={classes.textField}
                margin={"normal"}

                // invalid={!formElement.config.valid}
                // shouldValidate={formElement.config.validation}
                // touched={formElement.config.touched}
                onChange={( event ) => this.inputChangedHandler( event, formElement.id )} />
                <br/>
            </>
        ) );

        form = (
          <>
            
            <Typography component="h1" variant="h5" style={ {fontFamily:'Quicksand'}}>
              Log In
            </Typography>
            
            {form}

            <Button type="submit" variant="contained" color="primary" className={classes.button}>
              LOG IN
            </Button>

          </>
        )

        
        if (this.props.loading) {
            // form = <Spinner />
        }

        let errorMessage = null;

        if (this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }

        let authRedirect = null;
        if (this.props.isAuthenticated) {
            return (<Redirect to={this.props.authRedirectPath}/>);
        }

        return (
            
            <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={this.state.open}
            onClose={this.handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}>
            
                {/* <div className={classes.Auth}> */}
                
                <Fade in={this.state.open}>
                    <Paper>
                      
                    {authRedirect}
                    {errorMessage}
                    
                        <form onSubmit={this.submitHandler} 
                        className={classes.container}>

                            {form}

                        </form>
                    </Paper>
                </Fade>
                {/* </div> */}
            
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: ( username, password, isSignup ) => dispatch( actions.auth( username, password, isSignup ) ),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect( mapStateToProps, mapDispatchToProps )(  withStyles(styles)(Auth) );