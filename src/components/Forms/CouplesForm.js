import React, { useContext, useState, useEffect } from 'react'

import axios from "axios"
import LoadingSpinner from "../Loading/LoadingSpinner.js";
import UserInputContext from "../context/inputContext.js";
import TimeStamp from "./TimeStamp.js";

export default function CouplesForm() {
    const [leadName, setLeadName] = useState("");
    const [followName, setFollowName] = useState("");
    const [leadPhone, setLeadPhone] = useState("");
    const [followPhone, setFollowPhone] = useState("");
    const [time, setTime] = useState(null);
    const [listTimes] = useState({
        "6:30-7": { limit: 0 },
        "7-7:30": { limit: 0 },
        "7:30-8": { limit: 0 }
    })
    const [updateTime, setUpdateTime] = useState({
        "6:30-7": { follow: 0, lead: 0 },
        "7-7:30": { follow: 0, lead: 0 },
        "7:30-8": { follow: 0, lead: 0 }
    })

    const [timeID, setTimeID] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    //FireBase API
    const FireBaseAPI = process.env.REACT_APP_FIREBASE_API
    const { formType, setFormType } = useContext(UserInputContext);

    const getLeadName = (e) => { setLeadName(e.target.value); }
    const getLeadPhone = (e) => { setLeadPhone(e.target.value); }
    const getFollowName = (e) => { setFollowName(e.target.value); }
    const getFollowPhone = (e) => { setFollowPhone(e.target.value); }
    const timeInput = (e) => { setTime(e.target.value); }

    const getTimes = async () => {
        setIsLoading(true);
        const timeResponse = await axios.get(`${FireBaseAPI}/timesAvailable.json`);
        const id = Object.keys(timeResponse.data)[0]
        setTimeID(id);
        const arrayOfTimes = Object.keys(timeResponse.data[id]);
        for (let time of arrayOfTimes) {
            const followCount = timeResponse.data[id][time].follow;
            const leadCount = timeResponse.data[id][time].lead;
            const min = Math.min(followCount, leadCount);
            listTimes[time].limit = min
        }
        setIsLoading(false)
        setUpdateTime(timeResponse.data[id]);
        return timeResponse.data[id];
    }


    const saveSpotfor = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const userType = formType.type;

        const newCouple = {
            dacerType: userType,
            lead: leadName,
            follow: followName,
            leadPhone,
            followPhone,
            time
        }

        const coupleResponse = await axios.post(`${FireBaseAPI}couples.json`, newCouple);
        if (coupleResponse.data) {
            // console.log(updateTime);
            updateTime[time].follow--;
            updateTime[time].lead--;
            const timeResponse = await axios.put(`${FireBaseAPI}timesAvailable/${timeID}.json`, updateTime);
            if (timeResponse.data) {
                await getTimes();
            }

        }

        e.target.reset();
        setIsLoading(false);
    }

    useEffect(() => {
        getTimes();
    }, []);

    const backToOptions = () => {
        setFormType({
            type: "startingForm"
        })
    }

    return (
        <div>
            <button onClick={backToOptions} className="btn" > BACK</button>
            <h3 className="form-title"> Sign up for couples</h3>

            {
                isLoading ?
                    <LoadingSpinner /> :
                    <div className="row">
                        <form className="col s12" onSubmit={saveSpotfor}>
                            <TimeStamp timeGap="6:30-7" onChange={timeInput} value="6:30PM  - 7PM" limit={listTimes["6:30-7"].limit} />
                            <TimeStamp timeGap="7-7:30" onChange={timeInput} value="7PM  - 7:30PM" limit={listTimes["7-7:30"].limit} />
                            <TimeStamp timeGap="7:30-8" onChange={timeInput} value="7:30PM  - 8PM" limit={listTimes["7:30-8"].limit} />

                            <div className="row">
                                <div className="input-field col s6">
                                    <i className="material-icons prefix">account_circle</i>
                                    <input id="icon_prefix" type="text" className="validate" onChange={getLeadName} required />
                                    <label htmlFor="icon_prefix">lead's name</label>
                                </div>
                                <div className="input-field col s6">
                                    <i className="material-icons prefix">phone</i>
                                    <input id="icon_telephone" type="number" className="validate" onChange={getLeadPhone} />
                                    <label htmlFor="icon_telephone">telephone</label>
                                </div>
                            </div>

                            <div className="row">
                                <div className="input-field col s6">
                                    <i className="material-icons prefix">account_circle</i>
                                    <input id="icon_prefix" type="text" className="validate" onChange={getFollowName} required />
                                    <label htmlFor="icon_prefix">follow's name</label>
                                </div>
                                <div className="input-field col s6">
                                    <i className="material-icons prefix">phone</i>
                                    <input id="icon_telephone" type="number" className="validate" onChange={getFollowPhone} />
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
