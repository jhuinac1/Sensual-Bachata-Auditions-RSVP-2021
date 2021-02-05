import React, { useEffect, useState, useContext } from 'react';
import axios from "axios"
import LoadingSpinner from "../Loading/LoadingSpinner.js";
import UserInputContext from "../context/inputContext.js";
import TimeStamp from "./TimeStamp.js";

///🔥 🖼 
import './AllFormsStyle.css';

export default function LeadForm() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [time, setTime] = useState(null);
    const [listTimes, setListTimes] = useState({
        "6:30-7":  { follow: 0, lead: 0},
        "7-7:30":  { follow: 0, lead: 0},
        "7:30-8":  { follow: 0, lead: 0}
    })
    const [timeID, setTimeID] = useState(null)
    //This is for the loading component
    const [isLoading, setIsLoading] = useState(false);
    //FireBase API
    const FireBaseAPI = process.env.REACT_APP_FIREBASE_API
    const { formType, setFormType} = useContext(UserInputContext);

    const getName = (e) => { setName(e.target.value); }
    const getPhone = (e) => { setPhone(e.target.value); }
    const timeInput = (e) => { setTime(e.target.value); }

    const getTimes = async() => {
        setIsLoading(true);
        const timeResponse = await axios.get(`${FireBaseAPI}timesAvailable.json`);
        const id = Object.keys(timeResponse.data)[0]
        setTimeID(id);
        setListTimes(timeResponse.data[id]);
        setIsLoading(false)
        return timeResponse.data[id];
    }
    

    useEffect( () => {
        getTimes();
    }, [])


    const saveSpotfor = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const userType = formType.type;

        const newUser = {
            dancerType: userType,
            name,
            phone,
            time,
        }

        const checkTimes = await getTimes();
        // console.log(checkTimes);
        if(checkTimes[time][formType.type] > 0){
            // console.log(newUser);
            const userResponse = await axios.post(`${FireBaseAPI}/singles.json`, newUser);
            if(userResponse.data){
                listTimes[time][userType]--;
                const timeResponse = await axios.put(`${FireBaseAPI}timesAvailable/${timeID}.json`, listTimes);
                if(timeResponse.data){
                    await getTimes();
                }

            }

        }else{
            console.log("No more Spots for this time");
        }

        e.target.reset();
        setIsLoading(false);
    }

    

    const backToOptions = () => {
        setFormType({
            type: "startingForm"
        })
    }
    


    return (
        <div > 
            <button onClick={backToOptions} className="btn" > BACK</button>
            <h3 className="form-title">Select your time</h3>
            {
                isLoading ?
                    <LoadingSpinner /> :
                    <div className="row">
                        <form className="col s12" onSubmit={saveSpotfor}>
                            <TimeStamp timeGap="6:30-7" onChange={timeInput} value="6:30PM  - 7PM" limit={listTimes["6:30-7"][formType.type]} />
                            <TimeStamp timeGap="7-7:30" onChange={timeInput} value="7PM  - 7:30PM" limit={listTimes["7-7:30"][formType.type]} />
                            <TimeStamp timeGap="7:30-8" onChange={timeInput} value="7:30PM  - 8PM" limit={listTimes["7:30-8"][formType.type]}/>

                            <div className="row">
                                <div className="input-field col s6">
                                    <i className="material-icons prefix">account_circle</i>
                                    <input id="icon_prefix" type="text" className="validate" onChange={getName} required/>
                                    <label htmlFor="icon_prefix">{formType.type}'s' name</label>
                                </div>
                                <div className="input-field col s6">
                                    <i className="material-icons prefix">phone</i>
                                    <input id="icon_telephone" type="number" className="validate" onChange={getPhone} />
                                    <label htmlFor="icon_telephone">telephone</label>
                                </div>
                            </div>
                            <div>
                                <input type="submit" value="Submit" className="btn col s4 offset-s8 light-blue darken-4" />
                            </div>
                        </form>
                       
                    </div>
            }


        </div>
    )
}



///Graveyard
//Setting up the schema for the times available
      // const timesAvailable = {
        //     '6:30-7': {
        //         lead: 4,
        //         follow: 4, 
        //     },
        //     '7-7:30': {
        //         lead: 4,
        //         follow: 4, 
        //     },
        //     '7:30-8': {
        //         lead: 4,
        //         follow: 4, 
        //     }
        // }
        // const timeResponse = await axios.post(`${process.env.REACT_APP_FIREBASE_API}/timesAvailable.json`, timesAvailable);


