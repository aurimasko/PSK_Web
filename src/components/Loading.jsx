import React from 'react';
import ReactLoading from "react-loading";

class Loading extends React.Component {

    render() {
        return (
            <div style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
                <ReactLoading type={"bars"} color={"orange"} height={300} width={300} />
                <h1>Kraunasi...</h1>
            </div>
        )
    }

}

export default Loading;