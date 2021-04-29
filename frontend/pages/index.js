import Head from 'next/head' 
import Layout from '../components/layout' 
import useSWR, { mutate } from "swr";
import axios from "axios";
import React, { } from "react";
import styles from "../styles/Home.module.css";
import Menubar from "../components/menubar";
import Link from 'next/link';
const URL = "http://localhost/api/series";
const URL_SEL = "http://localhost/api/purchase";
const fetcher = (key) => fetch(key).then((res) => res.json());
const index = () => {
  const { data, error } = useSWR(URL, fetcher, { revalidateOnFocus: false });
  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading...</div>;
  console.log("data", data);
  const selStu = async (id) => {
    let result = await axios.post(`${URL_SEL}/${id}`)
    mutate(URL, data);
  }

  const showSeries = () => {
    if (data.list && data.list.length) {
      return data.list.map((item, index) => {
        return (
          <div className={styles.listItem} key={index}>
            <div><b>Name:</b> {item.name}</div>
            <div><b>Channel:</b> {item.channel}</div>
             <div> <b>Day:</b> {item.day} </div>
            <div><b>Time:</b> {item.time}</div>
            
            <div>
              <Link href="/login">
                <a>
                  <button className={styles.btn} onClick={() => selStu(item.id)}>
                    Select
                  </button>
                </a>
              </Link>
            </div>
          </div>
        );
      });
    } else {
      return <p>Loading...</p>;
    }
  };
  return (
    <Layout>
       <Head>
        <title>Home Page</title>
    </Head>
    <div className={styles.bar}>
      <div className={styles.logo}><h2>YSeries</h2></div>
      <div className={styles.bar2}>
        <Menubar />
      </div>
    </div>
    <div className={styles.container}>
      <h2>Wellcom to Y Zone !!</h2>
      <p>New Y series in 2021</p>
    </div>

    <ul className={styles.container2}>
      {showSeries()}
    </ul>
    </Layout>
  );
};
export default index;