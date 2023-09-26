import React, { useContext } from "react";
import { AppContext } from "../../appContext";

const Monolith = () => {
    const [context, setContext] = useContext(AppContext);
    return (
        <>
            Monolith
            <p>
                You approach the monolith. It's covered in strange markings. You
                can't read them, but you can make out the number{" "}
                {context.maps.length}
            </p>
        </>
    );
};

export default Monolith;
