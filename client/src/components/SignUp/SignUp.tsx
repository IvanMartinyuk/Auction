import { useState } from "react";
import { UserService } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import React from "react";
import Notification from "../Notification/Notification";

const SignUp = () => {
    const [user, setUser] = useState({
        id: 0,
        name: '',
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
        userService.signUp(user).then(isOk => {
            if(isOk) {
                sessionStorage.setItem('isJustSignedUp', 'true');
                navigate('/');
            }
            else {
                showNotification({...notifictionSettings, backgroundColor: 'red', text: 'Sign up error' });
            }
        }).catch(error => {
                showNotification({...notifictionSettings, backgroundColor: 'red', text: 'Server error' });
            });
        
    };

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
                    <h3 className="text-center">Sign up</h3>
                </div>
                <div className="mt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mt-2">
                            <label className="fw-bold">Name:</label>
                            <input type="text" 
                                   className="form-control" 
                                   id="name" 
                                   name="name" 
                                   onChange={handleChange} 
                                   value={user.name}
                                   required/>
                        </div>
                        <div className="form-group mt-2">
                            <label className="fw-bold">Login:</label>
                            <input type="text" 
                                   className="form-control" 
                                   id="login" 
                                   name="login" 
                                   onChange={handleChange} 
                                   value={user.login}
                                   required/>
                        </div>
                        <div className="form-group mt-2">
                            <label className="fw-bold">Password:</label>
                            <input type="password" 
                                   className="form-control" 
                                   id="password" 
                                   name="password" 
                                   onChange={handleChange} 
                                   value={user.password}
                                   required/>
                        </div>
                        <div className="d-flex justify-content-center mt-2">
                            <button type="submit" className="btn  btn-outline-dark btn-block">Sign up</button>
                        </div>
                        <div className='d-flex'>
                            <div className='m-1'>Already have an account?</div>
                            <a href='/' className='m-1'>sign in</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>        
    );
}

export default SignUp;