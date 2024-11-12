import { useRouteError } from "react-router-dom";

export default function ChatErrorPage(){

    const error:unknown = useRouteError();
    const errorMessage = error instanceof Error ? error.message : "Try again later";

    console.log(error);
    

    return(
        <div id="genericErrorWrapper">
            <div>
                <i className="fa-solid fa-face-frown mb-5" style={{color: "#afafaf"}}/>
                Oops! An error occurred. <br />
                    {error && typeof error === "object" && "status" in error && "statusText" in error && "data" in error ?
                    (
                        `Server responded with a status of ${error.status} - ${error.statusText}
                        ${error.data}`
                    ) : (
                    <div>
                        {errorMessage}
                    </div>)
                }
            </div>
        </div>
    )
}