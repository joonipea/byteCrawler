import React, { useState } from "react";

const AppContext = React.createContext([{}, () => {}]);

let initialState = false;

const AppProvider = (props) => {
    const [state, setState] = useState(initialState);

    return (
        <AppContext.Provider value={[state, setState]}>
            {props.children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
