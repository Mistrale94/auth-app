import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Web3 from 'web3';
import ContractABI from '../../build/contracts/Auth.json';

const Signin = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter();

    useEffect(() => {
        const initWeb3 = async () => {
            if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                const deployedNetwork = ContractABI.networks[Object.keys(ContractABI.networks)[0]];
                const instance = new web3Instance.eth.Contract(
                    ContractABI.abi,
                    deployedNetwork && deployedNetwork.address,
                );
                setContract(instance);
            } else {
                console.error('Ethereum browser extension not detected.');
            }
        };

        initWeb3();
    }, []);

    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!web3 || !contract) {
            alert("Le contrat n'est pas chargé correctement");
            return;
        }

        try {
            const isAuthSuccessful = await contract.methods.verifyUser(username, email, password).call();
            
            if (isAuthSuccessful) {
                localStorage.setItem('username', username);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userPassword', password);
                router.push('/');
            } else {
                alert('Identifiants incorrects');
            }
        } catch (error) {
            console.error("Erreur lors de la connexion: ", error);
            alert("Erreur lors de la connexion. Veuillez réessayer.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSignIn}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default Signin;
