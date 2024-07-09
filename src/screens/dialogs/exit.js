const Exit = ({ onConfirm, setParent }) => {
    return (
        <>
            <p>Would you like to climb higher?</p>
            <button
                onClick={() => {
                    onConfirm();
                    setParent([]);
                }}
                className="btn">
                Yes
            </button>
        </>
    );
};

export default Exit;
