import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import Menubar from '../components/menubar'
import axios from 'axios'
import config from '../config/config'
import Link from 'next/link'

export default function Register({ token }) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')
    const profileUser = async () => {
        console.log('token: ', token)
        const users = await axios.get(`${config.URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        console.log('user: ', users.data)
    }

    const register = async (req, res) => {
        try {
            let result = await axios.post(`${config.URL}/register`,
                { username, email, password })
            console.log('result: ', result)
            console.log('result.data:  ', result.data)
            console.log('token:  ', token)
            setStatus(result.data.message)
        }
        catch (e) {
            console.log(e)
        }

    }

    const registerForm = () => (
        <div className={styles.gridContainer}>
            <div>
                <b>Username:</b>
            </div>
            <div>
                <input type="text"
                    name="username"
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <b>Email:</b>
            </div>
            <div>
                <input type="email"
                    name="email"
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <b>Password:</b>
            </div>
            <div>
                <input type="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
        </div>
    )


    return (
        <Layout>
            <Head>
                <title>Register Page</title>
            </Head>
            <div className={styles.bar}>
                <div className={styles.logo}><h2>YSeries</h2></div>
                 <div className={styles.bar2}>
                    <Menubar />
                </div>
            </div>
            <div className={styles.container}>
                <h1>Register</h1>
                <br />
            <b>Status: </b> <i>{status}</i>
                <br /><br />
                <div className={styles.content}>
                    {registerForm()}
                </div>

                <div>
                    <Link href="/login">
                        <a>
                            <button className={styles.btn} onClick={register}>Register</button>
                        </a>
                    </Link>
                </div>
            </div>
        </Layout>
    )
}
export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}