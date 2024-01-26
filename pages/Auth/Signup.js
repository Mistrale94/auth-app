import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Web3 from 'web3';
import ContractABI from '../../build/contracts/Auth.json';
import styles from '../../styles/Home.module.css'


const Signup = () => {
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
                const web3 = new Web3(window.ethereum);
                setWeb3(web3);

                const deployedNetwork = ContractABI.networks[Object.keys(ContractABI.networks)[0]];
                const instance = new web3.eth.Contract(
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

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.createUser(username, email, password).send({ from: accounts[0] });
            alert('Inscription réussie. Redirection vers la page de connexion.');
            router.push('/Auth/Signin');
        } catch (error) {
            console.error("Erreur lors de l'inscription: ", error);
            alert("Erreur lors de l'inscription. Veuillez réessayer.");
        }
    };

    return (
        <div className={styles.container_btns}>
            <h1>Inscription</h1>
            <form onSubmit={handleSignUp}>
                <input className={styles.inputField} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <input className={styles.inputField} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input className={styles.inputField} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button className={styles.btnSubmit} type="submit">Inscription</button>
            </form>
            <p>Retourner à <a className={styles.link} href="/">L'accueil</a></p>

        </div>
    );
};

export default Signup;
