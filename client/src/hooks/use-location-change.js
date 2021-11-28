import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const usePrevious = (value) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    })

    return ref.current;
}

export const useLocationChange = (callback) => {
    const location = useLocation();
    const prevLocation = usePrevious(location);
    useEffect(() => {
        if (prevLocation?.pathname !== location.pathname) {
            callback();
        }
    }, [location, prevLocation, callback])
}
