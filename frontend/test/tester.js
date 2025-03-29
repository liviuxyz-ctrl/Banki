import axios from "axios";
import {AUTH_ENDPOINT} from "../constants";

export function generateFakeIBAN() {
    const randomNumber = Math.floor(Math.random() * 10000000000)
        .toString()
        .padStart(10, '0');
    return `DE${randomNumber}`;
}

export function createTestAccount() {

    axios.post(AUTH_ENDPOINT, {
        data: {
            IBAN: generateFakeIBAN(),
            balance: 1500.50,
        }
    })
        .then(response => {
            console.log("Account created:", response.data);
        })
        .catch(err => {
            console.error("Error creating account:", err);
        });

}



