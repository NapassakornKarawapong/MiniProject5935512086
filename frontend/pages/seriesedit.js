import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from "../styles/series.module.css";
import withAuth from "../components/withAuth";
import Navbar from "../components/navbar";
import Layout from "../components/layout";
const URL = "http://localhost/api/series";
const admin = ({ token }) => {
  const [user, setUser] = useState({});
  const [series, setSeries] = useState({});
  const [name, setName] = useState("");
  const [channel, setChannel] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState(0);
  const [serie, setSerie] = useState({});
  useEffect(() => {
    getSeries();
    profileUser();
  }, []);
  const profileUser = async () => {
    try {
      
      const users = await axios.get(`${config.URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      setUser(users.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getserie = async (id) => {
    const result = await axios.get(`${URL}/${id}`)
    console.log('serie id: ', result.data)
    setSerie(result.data)
}
  const getSeries = async () => {
    let result = await axios.get(URL);
    setSeries(result.data.list);
  };
  const addSerie = async () => {
    let result = await axios.post(URL, {
      name,
      channel,
      day,
      time,
    });
    console.log(result);
    getSeries();
  };
  const deleteSerie = async (id) => {
    let result = await axios.delete(`${URL}/${id}`);
    getSeries();
  };



  const updateSerie = async (id) => {
    let result = await axios.put(`${URL}/${id}`, {
      name,
      channel,
      day,
      time,
    });
    console.log(result);
    getSeries();
  };
  const showSeries = () => {
    if (series && series.length) {
      return series.map((item, index) => {
        return (
          <div className={styles.showSeries} key={index}>
            <b>Name:</b> {item.name} <br />
            <b>Channel:</b> {item.channel} <br />
            <b>Day:</b> {item.day} <br />
            <b>Time:</b> {item.time}
            <div className={styles.edit_button}>
              <button
                className={styles.button_get}
                onClick={() => getserie(item.id)}
              >Get</button>
              <button
                className={styles.button_update}
                onClick={() => updateSerie(item.id)}
              >Update</button>
              <button
                className={styles.button_delete}
                onClick={() => deleteSerie(item.id)}
              >Delete</button>
            </div>
          </div>
        );
      });
    } else {
      return <p>Loading...</p>;
    }};
  return (
    <Layout>
      <div className={styles.bar}>
        <div className={styles.logo}><h2>YSeries</h2></div>
        <div className={styles.bar2}><Navbar /></div>
      </div>
      <div className={styles.container}>
        <h1><ins>Serie Data Edit </ins></h1>
        <div className={styles.form_add}>
        <h2>Add Series</h2>
        Name:
        <input
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
        ></input>
        Channel:
        <input
          type="text"
          name="channel"
          onChange={(e) => setChannel(e.target.value)}
        ></input>
        Day:
        <input
          type="text"
          name="day"
          onChange={(e) => setDay(e.target.value)}
        ></input>
        Time:
        <input
          type="number"
          name="time"
          onChange={(e) => setTime(e.target.value)}
        ></input>
        <button className={styles.button_add} onClick={() => addSerie(name, channel, day, time)}>
          Add
        </button>
      </div>

      <div className={styles.list}>{showSeries()}</div>
      <div className={styles.list1}><b><i><ins>(selected serie)</ins></i></b> <b>  Name:</b>{serie.name}<b>  
        Channel:</b>{serie.channel} <b> Day:</b>{serie.day}  <b>Time:</b>{serie.time}</div>
    </div>
    </Layout>
    
  );
};
export default withAuth(admin);

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
