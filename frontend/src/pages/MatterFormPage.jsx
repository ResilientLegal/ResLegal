import { useEffect } from "react";
import MatterForm from "../components/MatterForm";
import TimeLine from "../components/TimeLine";
import { useParams } from "react-router-dom";

const MatterFormPage = () => {
    const { id } = useParams();

    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", height: "100%"  }}>
            <MatterForm />
            <div style={{ marginTop: "70px", width: "300px" }}>
                <TimeLine matterId={id} />
            </div>
        </div>
    );
};

export default MatterFormPage;