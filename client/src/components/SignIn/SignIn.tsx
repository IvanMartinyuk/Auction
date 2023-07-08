import { useEffect, useState } from "react";
import { UserService } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import React from "react";
import Notification from "../Notification/Notification";

const SignIn = () => {
    const [user, setUser] = useState({
        login: '',
        password: ''
    });
    const [isShowNotification, setIsShowNotification] =  useState<boolean>(false);
    const [notifictionSettings, setNotifictionSettings] = useState({
        backgroundColor: "red",
        fontColor: "white",
        fadeTime: 1500,
        text: "Notification text"
    });

    const navigate = useNavigate();

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        let userService = new UserService();
        userService.signIn(user).then(isOk => {
            console.log(isOk)
            if(isOk) {
                sessionStorage.setItem('isReloaded', 'true');
                navigate(0);
            }
            else {
                showNotification({...notifictionSettings, backgroundColor: 'red', text: 'Login or password error' });
            }
        }).catch(error => {
            console.log(error);
            showNotification({...notifictionSettings, backgroundColor: 'red', text: 'Server error' });
        })
    };

    useEffect(() => {
        if(sessionStorage.getItem('isReloaded')) {
            sessionStorage.removeItem('isReloaded')
            navigate('/bids');
        }
        if(sessionStorage.getItem('isJustSignedUp')) {
            sessionStorage.removeItem('isJustSignedUp')
            showNotification({...notifictionSettings, backgroundColor: 'green', text: 'You have just signed up' });
        }
    }, [])

    const showNotification = (value: React.SetStateAction<{
        backgroundColor: string;
        fontColor: string;
        fadeTime: number;
        text: string;
    }>)  => {
        setNotifictionSettings(value);
        setIsShowNotification(true);
        setTimeout(() => {
            setIsShowNotification(false);
        }, notifictionSettings.fadeTime * 2);
    }

    return (
        <div className="d-flex justify-content-center align-items-center h-90">
            { isShowNotification && (
                    <Notification backgroundColor={ notifictionSettings.backgroundColor }
                                  fontColor={ notifictionSettings.fontColor }
                                  fadeTime={ notifictionSettings.fadeTime }
                                  text={ notifictionSettings.text }/>
                )}
            <div className="text-center">
                <div className="card-header">
                    <h3 className="text-center">Sign in</h3>
                </div>
                <div className="mt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mt-2">
                            <label className="fw-bold">Login:</label>
                            <input type="text" 
                                   className="form-control" 
                                   id="login" 
                                   name="login" 
                                   value={user.login}
                                   onChange={handleChange}
                                   required/>
                        </div>
                        <div className="form-group mt-2">
                            <label className="fw-bold">Password:</label>
                            <input type="password" 
                                   className="form-control" 
                                   id="password" 
                                   name="password" 
                                   value={user.password}
                                   onChange={handleChange}
                                   required/>
                        </div>
                        <div className="d-flex justify-content-center mt-2">
                            <button type="submit" className="btn  btn-outline-dark btn-block">Sign in</button>
                        </div>
                        <div className='d-flex'>
                            <div className='m-1'>Don't have account?</div>
                            <a href='/signup' className='m-1'>create now</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>        
    );
}

export default SignIn;