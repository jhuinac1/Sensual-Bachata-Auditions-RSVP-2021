import React from 'react'

export default function TimeStamp(props) {

    return (
        <div className="time-stamp">
            <label>
                <input name="group1" 
                        type="radio"  
                        value={props.timeGap} 
                        required
                         onChange={props.onChange}
                        disabled={props.limit < 1? "disabled" : ""} />
                         
                <span>{props.value}</span>

                <span className="limit" > <strong> <span className={props.limit> 0? 'available': 'not-available'} >{props.limit}</span>  spot(s) left</strong> </span>
            </label>
        </div>
    )
}
