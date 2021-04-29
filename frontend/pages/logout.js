import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import config from '../config/config'
import Logoutbar from '../components/Logoutbar'
export default function Logout({ token }) {
    const [status, setStatus] = useState('')
    useEffect(() => {
        logout()
    }, [])
    const logout = async () => {
        console.log('remove token: ', token)
        let result = await axios.get(`${config.URL}/logout`, { withCredentials: true })
        setStatus("Logout successful")
    }
    return (
        <Layout>
            <Head>
                <title>Logout Page</title>
            </Head>
            <div className={styles.bar}>
                <div className={styles.logo}><h2>YSeries</h2></div>
                 <div className={styles.bar2}>
                    <Logoutbar />
                </div>
            </div>
            <div className={styles.container}>
                <Navbar />
                <h1>Logout</h1>
                <div>
                    <h2> {status}  </h2>
                </div>
            </div>
        </Layout>
    )
}




