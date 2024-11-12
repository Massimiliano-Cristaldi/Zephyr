import { useRouteError } from "react-router-dom";
import "../css/Errors.css";

export default function GenericErrorPage(){

    const error:any = useRouteError();

    return(
        <div id="genericErrorWrapper">
            <div>
                <i className="fa-solid fa-face-frown mb-5" style={{color: "#afafaf"}}/>
                Oops! An error occurred. <br />
                {error.status && error.statusText && error.data ?
                    (<div>
                        Server responded with a status of {error.status} - {error.statusText} <br />
                        {error.data}
                    </div>) : 
                    (<div>
                        {error.message}
                    </div>)
                }
            </div>
        </div>
    )
}