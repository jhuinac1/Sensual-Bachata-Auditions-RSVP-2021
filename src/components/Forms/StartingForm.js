import React, {useState, useContext} from 'react'
import LoadingSpinner from "../Loading/LoadingSpinner.js";
import UserInputContext from "../context/inputContext.js";


export default function StartingForm() {
    const [isLoading, setIsLoading] = useState(false);

    const {setFormType } = useContext(UserInputContext);

    const setUserOption = (e) =>{
        setIsLoading(true);
        const pick = e.target.innerText.toLowerCase()
        setFormType({ type: pick}) 
        setIsLoading(false);
    }


    return (
        <div className='starting-form'>
            { isLoading? 
            <LoadingSpinner /> :
            <div className="card row">
                <div className="card-content center-align">
                    <h5 className="">Click on next option</h5>
                </div>
                <div className="card-action">
                    <button className="btn waves-effect indigo darken-3" type="submit" name="action" onClick={setUserOption}> Lead </button>
                    <button className="btn waves-effect indigo darken-3" type="submit" name="action" onClick={setUserOption}> Follow </button>
                    <button className="btn waves-effect indigo darken-3" type="submit" name="action" onClick={setUserOption}> Couple </button>
                </div>
            </div> }
            
            
        </div>
    )
}
