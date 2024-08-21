import React, { useState } from 'react';
import styled from 'styled-components';
import { createUser} from '../services/api';
import { useNavigate } from 'react-router-dom';


const SignupWrapper = styled.div`
    // Your existing styles
`;

const Card = styled.div`
    // Your existing styles
`;

const Signup = () => {
    // const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newUser, setNewUser] = useState({ username: '', email: '',password:'' });
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newUser.password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await createUser(newUser);
            alert('Signup successful!');
            setNewUser({ username: '', email: '' ,password:''});
            setConfirmPassword('')
            navigate('/');
        } catch (error) {
            alert('Error creating post');
        }
    };

    return (
        <SignupWrapper>
            <Card>
                <h3 className="card-title text-center mb-4">Sign Up</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                </form>
            </Card>
        </SignupWrapper>
    );
};

export default Signup;
