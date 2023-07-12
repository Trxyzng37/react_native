
import React, { useEffect, useState, toString } from 'react';
import type { Node } from 'react';
import { SafeAreaView, Pressable, TouchableWithoutFeedback, ScrollView, FlatList, StatusBar, StyleSheet, Text, useColorScheme, View, Button, Image, TextInput, Dimensions, ImageBackground } from 'react-native';

import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/database';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';



let w = Dimensions.get("window").width;
let h = Dimensions.get("window").height;

const heart_arr = [];
const spo2_arr = [];
const td_arr = [];
const msg_arr = [];
const key_arr = [];
//home screen begin
function HomeScreen() {
  const [heartbeat, update_heartbeat] = useState(0)
  const [spo2, update_spo2] = useState(0)
  const [hour, update_hour] = useState(0)
  const [minute, update_minute] = useState(0)
  const [second, update_second] = useState(0)
  const [day, update_day] = useState(0)
  const [month, update_month] = useState(0)
  const [year, update_year] = useState(0)
  const [status, update_status] = useState(0)
  const [oo, update_oo] = useState(1)
  let msg = ''
  const [word, update_word] = useState("")

  useEffect(() => {                              //run every time value added to database
    const reference = firebase
      .app()
      .database('https://esp32-af5ad-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref("User/Data");
    reference
      .on('child_added', snapshot => {
        console.log("snapshot: ", snapshot.val())
        let k = snapshot.key;
        msg = (snapshot.val()).toString();
        let hr = msg.substring(0, 2)
        let me = msg.substring(2, 4)
        let sd = msg.substring(4, 6)
        let dy = msg.substring(6, 8)
        let mh = msg.substring(8, 10)
        let yr = msg.substring(10, 12)
        let ht = msg.substring(12, msg.length - 2)
        let s2 = msg.substring(msg.length - 2, msg.length + 1)
        let td = hr + ":" + me + ":" + sd

        update_heartbeat(ht)
        update_spo2(s2)
        update_hour(hr)
        update_minute(me)
        update_second(sd)
        update_day(dy)
        update_month(mh)
        update_year(yr)
        if (ht == "00" && s2 == "00") {        //if msg contains 0000
          update_status(0)
          //update_oo(0)
          update_heartbeat("0")
          update_spo2("0")
          update_word("Device not connected")
        }
        else if (ht == "AA" && s2 == "AA") {
          update_status(1)
          update_heartbeat("0")
          update_spo2("0")
          update_word("Device is connected")
        }
        else {                       //if msg is normal
          update_status(1)
          update_oo(1)
          let mmm = "Sample at: " + hr + ":" + me + ":" + sd
          update_word(mmm)
          if (td_arr.length > 19) {
            heart_arr.shift();
            spo2_arr.shift();
            td_arr.shift();
          }
          heart_arr.push(ht);
          spo2_arr.push(s2);
          td_arr.push(td);
        }
        console.log(heart_arr.length);
      });
  }, [msg]);

  const [hms, update_hms] = useState()
  const [dmy, update_dmy] = useState()
  useEffect(() => {
    setInterval(() => {
      update_hms(moment(new Date()).format('HH:mm:ss'))
      update_dmy(moment(new Date()).format('DD/MM/YYYY'))
    }, 1000)
  }, [hms])

  const [s, update_s] = useState(1)
  const [z, update_z] = useState(10)
  const [heart_load, updateheart_load] = useState(1)
  const [collor, update_collor] = useState("#3ABD6F")
  useEffect(() => {
    setTimeout(() => {
      update_s(0)
      update_z(1)
      updateheart_load(0)
      update_collor("white")
    }, 1500)
  }, [])

  return (
    <View style={{ backgroundColor: "#EBD9F0" }}>
      <View Style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly", elevation: 2, }}>
        <StatusBar hidden={true} />
        {/*contain heartbeat, oxygen, device box*/}
        <View style={{ justifyContent: "space-evenly", alignItems: "center", height: h * 0.4, paddingTop: h * 0.0, backgroundColor: "white" }}>
          {/*device box*/}
          <View style={{ flexDirection: "row", width: w * 0.93, height: h * 0.1, backgroundColor: "#f7ed9c", borderRadius: 5, justifyContent: "space-around", alignItems: "center", elevation: 5, flexDirection: "row" }}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <View>
                <ImageBackground
                  source={require("./img/power_off.png")}
                  style={{ width: w * 0.1, height: w * 0.1 }}
                />
                <Image
                  source={require("./img/power_on.png")}
                  style={{ width: w * 0.1, height: w * 0.1, position: "absolute", opacity: status }}
                />
              </View>
            </View>
            <View style={{ flex: 1, alignItems: "center", }}>
              <Text style={{ fontSize: w * 0.04, color: "black" }}>{dmy}</Text>
              <Text style={{ fontSize: w * 0.04, color: "black" }}>{hms}</Text>
            </View>
          </View>
          {/*contain both heartbeat and oxygen box*/}
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: w }}>
            {/*heart box*/}
            <View style={{ width: w * 0.45, height: w * 0.45, backgroundColor: "#3ABD6F", justifyContent: "center", borderRadius: 5, elevation: 5 }}>
              {/*image and text*/}
              <View style={{ alignItems: "flex-start" }}>
                <View style={{ flexDirection: 'row', paddingLeft: w * 0.03, alignItems: "center", justifyContent: "flex-start" }}>
                  <Image
                    source={require("./img/heart.png")}
                    style={{ width: w * 0.1, height: w * 0.1 }}
                  />
                  <Text style={{ fontSize: w * 0.05, color: "black", marginLeft: w * 0.02 }}>Heartbeat</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "baseline", marginLeft: w * 0.03 }}>
                <Text style={{ fontSize: w * 0.15, color: "white" }}>{heartbeat}</Text>
                <Text style={{ fontSize: w * 0.05, color: "white" }}>bpm</Text>
              </View>

              <View style={{ alignItems: "flex-start", paddingLeft: w * 0.03 }}>
                <Text style={{ fontSize: w * 0.04, color: "black", opacity: 1 }}>{word}</Text>
              </View>
            </View>

            {/*oxygen box*/}
            <View style={{ width: w * 0.45, height: w * 0.45, backgroundColor: "#3ABD6F", justifyContent: "center", borderRadius: 5, elevation: 5 }}>
              {/*image and text*/}
              <View style={{ alignItems: "flex-start" }}>
                <View style={{ flexDirection: 'row', paddingLeft: w * 0.03, alignItems: "center", justifyContent: "flex-start" }}>
                  <Image
                    source={require("./img/oxygen.png")}
                    style={{ width: w * 0.1, height: w * 0.1 }}
                  />
                  <Text style={{ fontSize: w * 0.05, color: "black", marginLeft: w * 0.02 }}>SpO2</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "baseline", marginRight: w * 0.03 }}>
                <Text style={{ fontSize: w * 0.15, color: "white" }}>{spo2}</Text>
                <Text style={{ fontSize: w * 0.05, color: "white" }}>%</Text>
              </View>

              <View style={{ alignItems: "flex-start", paddingLeft: w * 0.03 }}>
                <Text style={{ fontSize: w * 0.04, color: "black", opacity: 1 }}>{word}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
          {/*chart screen*/}
          <CHART_HEART />
          <Text style={{ fontSize: 60, color: "white" }}>Trxyzng</Text>
        </View>
      </View >
      {/*load screen*/}
      <View style={{ backgroundColor: collor, width: w, height: h, justifyContent: "center", alignItems: "center", position: "absolute", elevation: z, opacity: s }}>
        <Image
          source={require("./img/load.png")}
          style={{ width: w * 0.25, height: w * 0.25, opacity: heart_load }}
        />
        <Text style={{ fontSize: h * 0.03, color: "white", marginTop: h * 0.02, opacity: heart_load }}>Health Monitor</Text>
        <Text style={{ fontSize: h * 0.02, color: "white", marginTop: h * 0.01, opacity: heart_load }}>Nguyen Dinh Hong Quan</Text>
        <Text style={{ fontSize: h * 0.02, color: "white", marginTop: h * 0.0, opacity: heart_load }}>Hoac Chi Trung</Text>
      </View>
    </View>
  );
}

const TIME_HMS = () => {
  const [hms, update_hms] = useState()
  const [dmy, update_dmy] = useState()
  useEffect(() => {
    setInterval(() => {
      update_hms(moment(new Date()).format('HH:mm:ss'))
      update_dmy(moment(new Date()).format('DD/MM/YYYY'))
    }, 1000)
  }, [hms])
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: w * 0.035, color: "black", opacity: 0.8 }}>{dmy}</Text>
      <Text style={{ fontSize: w * 0.035, color: "black", opacity: 0.8 }}>{hms}</Text>
    </View>
  )
}

const CHART_HEART = () => {
  let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })
  return (
    <View style={{ borderRadius: 10 }}>
      <LineChart
        data={{
          labels: td_arr,
          datasets: [
            {
              data: [...heart_arr],
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            },
            {
              data: [...spo2_arr],
              color: (opacity = 1) => `rgba(0, 0, 121,${opacity})`,
            },
          ],
          legend: ["Heart beat (bpm)", "SpO2 (%)"],
        }}
        width={w * 0.93}
        height={h * 0.45}
        withShadow={false}
        withVerticalLines={false}
        yAxisInterval={1}
        segments={6}
        withVerticalLabels={true}
        chartConfig={{
          backgroundColor: "#faf3de",
          backgroundGradientFrom: "#faf3de",
          backgroundGradientTo: "#faf3de",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForVerticalLabels: {
            rotation: 90,
            translateX: -4,
            translateY: 5,
            fontSize: 10
          },
          propsForBackgroundLines: {
            strokeDasharray: "", // solid background lines with no dashes
            strokeDashoffset: 15
          },
          propsForDots: {
            r: "2",
            strokeWidth: "0",
            stroke: "#fbfbfb"
          }
        }}
        bezier
        style={{
          borderRadius: 5,
          paddingLeft: - w * 0.1,
          elevation: 5,
        }}
      />
    </View>
  )
}
////////////

////////////
function App() {
  return <HomeScreen />;
}

export default App;
