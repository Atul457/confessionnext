import axios from "axios";
import { envConfig } from "../utils/envConfig"
import { isWindowPresent } from "./checkDom";

const baseURL = envConfig.isProdMode ? envConfig.liveBaseUrl : envConfig.devBaseUrl

export const http = async (props) => {

    return new Promise(async (resolve, reject) => {

        let config = {
            baseURL: `${baseURL}${props?.url}`,
            method: props?.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                token: props?.token,
                ip_address: localStorage.getItem("ip"),
            },
            data: props?.data,
        }

        try {
            const response = await axios(config);
            if (response?.data?.status === true) {
                resolve(response)
                return response;
            } else {
                if (response?.data?.logout === true) {
                    if (isWindowPresent()) {
                        localStorage.removeItem("authenticated");
                        localStorage.removeItem("userDetails");
                        window.location.href = "/login?message=1";
                    }
                }
                return response
            }
        } catch (error) {
            reject(error)
        }
    })
}

