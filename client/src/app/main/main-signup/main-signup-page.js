import React              from 'react';
import ReactDOM           from 'react-dom';
import _                  from 'lodash';

import i18n               from 'lib-app/i18n';
import API                from 'lib-app/api-call';
import SessionStore       from 'lib-app/session-store';

import Captcha            from 'app/main/captcha';
import SubmitButton       from 'core-components/submit-button';
import Message            from 'core-components/message';
import Form               from 'core-components/form';
import FormField          from 'core-components/form-field';
import Widget             from 'core-components/widget';


class MainSignUpPageWidget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            email: null
        };
    }

    render() {
        return (
            <div className="main-signup-page">
                <Widget className="signup-widget col-md-6 col-md-offset-3" title="Register">
                    <Form {...this.getFormProps()}>
                        <div className="signup-widget__inputs">
                            <FormField {...this.getInputProps()} label="Full Name" name="name" validation="NAME" required/>
                            <FormField {...this.getInputProps()} label="Email Address" name="email" validation="EMAIL" required/>
                            <FormField {...this.getInputProps(true)} label="Password" name="password" validation="PASSWORD" required/>
                            <FormField {...this.getInputProps(true)} label="Repeat Password" name="repeated-password" validation="REPEAT_PASSWORD" required/>
                        </div>
                        <div className="signup-widget__captcha">
                            <Captcha ref="captcha"/>
                        </div>
                        <SubmitButton type="primary">SIGN UP</SubmitButton>
                    </Form>

                    {this.renderMessage()}
                </Widget>
            </div>
        );
    }
    
    renderMessage() {
        switch (this.state.message) {
            case 'success':
                return <Message type="success">{i18n('SIGNUP_SUCCESS')}</Message>;
            case 'fail':
                return <Message type="error">{i18n('EMAIL_EXISTS')}</Message>;
            default:
                return null;
        }
    }

    getFormProps() {
        return {
            loading: this.state.loading,
            className: 'signup-widget__form',
            onSubmit: this.onLoginFormSubmit.bind(this)
        };
    }

    getInputProps(password) {
        return {
            className: 'signup-widget__input',
            fieldProps: {
                size: 'medium',
                password: password
            }
        };
    }

    onLoginFormSubmit(formState) {
        const captcha = this.refs.captcha.getWrappedInstance();

        if (!captcha.getValue()) {
            captcha.focus();
        } else {
            this.setState({
                loading: true
            });

            API.call({
                path: '/user/signup',
                data: _.extend({captcha: captcha.getValue()}, formState)
            }).then(this.onSignupSuccess.bind(this)).catch(this.onSignupFail.bind(this));
        }
    }

    onSignupSuccess() {
        this.setState({
            loading: false,
            message: 'success'
        });
    }

    onSignupFail() {
        this.setState({
            loading: false,
            message: 'fail'
        });
    }
}

export default MainSignUpPageWidget;