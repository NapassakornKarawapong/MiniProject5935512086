import Head from 'next/head' 
import Layout from '../components/layout' 
import useSWR, { mutate } from "swr";
import axios from "axios";
import React, { } from "react";
import styles from "../styles/Home.module.css";
import Menubar from "../components/menubar";
const URL = "http://localhost/api/students";
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

  const showStudents = () => {
    if (data.list && data.list.length) {
      return data.list.map((item, index) => {
        return (
          <div className={styles.listItem} key={index}>
            <div><b>Name:</b> {item.name}</div>
            <div><b>Surname:</b> {item.surname}</div>
             <div> <b>Major:</b> {item.major} </div>
            <div><b>GPA:</b> {item.GPA}</div>
            
            <div>
            <button
              className={styles.btn}
              onClick={() => selStu(item.id)}
            >
              Select
            </button></div>
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
      <div className={styles.logo}><h2>Y</h2></div>
      <div className={styles.bar2}>
        <Menubar />
      </div>
    </div>

    <div className={styles.container}>
      
      
      <div className={styles.title}>
      </div>

      <div className={styles.list}>
        {showStudents()}
      </div>
      
    </div>
    </Layout>
  );
};
export default index;
