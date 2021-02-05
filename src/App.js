import React, { useState, useEffect } from 'react'
import './App.css';
import StartingForm from "./components/Forms/StartingForm.js";
import SingleForm from "./components/Forms/SingleForm.js";
import Navbar from "./components/global/Navbar.js";
import CouplesForm from "./components/Forms/CouplesForm.js";
import EndOfAudition from "./components/modals/EndOfAudition.js";

//more simpler than redux, and comes pre-installed with react
//lets use use state , but not local to a single component but
//local to scope of components, and in this case scope of the whole
//app ...this can be set up as a component, we can put data in here
import UserInputContext from "./components/context/inputContext";

function App() {

  const [formType, setFormType] = useState({
    type: "startingForm",
  });
  const [formEnded, setFormEnded] = useState(true);

  // const getDatesAvailability = async() => {
  //   const datesResponse = await axios.get(`${process.env.REACT_APP_FIREBASE_API}/userInfo.json`);
  //   const allDancers = datesResponse.data;
  //   console.log(allDancers);
  //   // for(let id in allDancers){
  //   //   console.log(allDancers[id].name, allDancers[id].phone);
  //   // }
  // }


  useEffect(() => {
    //I will use this later to get all dancers that signed up
    // getDatesAvailability();
  }, [formType])

  return (
    <div className="App ">
      <UserInputContext.Provider value={{ formType, setFormType }}>
        <Navbar />
        {
          formEnded ?
            <EndOfAudition /> :

            <section className="valign-wrapper">

              {formType.type === "startingForm" && <StartingForm />}
              {formType.type === "lead" && <SingleForm />}
              {formType.type === "follow" && <SingleForm />}
              {formType.type === "couple" && <CouplesForm />}

            </section>

        }

      </UserInputContext.Provider>
    </div>
  );
}

export default App;
