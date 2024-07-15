import axios from "axios";
import { v4 as uuid } from "uuid";
import { CodeGenerator } from "../../theme";


const momoHost = 'sandbox.momodeveloper.mtn.com';
const momoTokenUrl = `https://${momoHost}/collection/token/`;
const momoRequestToPayUrl = `https://${momoHost}/collection/v1_0/requesttopay`;



export const generateMoMoToken = async()=>{
    let momoToken = null;
    try {
 
        const momoTokenResponse = await axios.post(
            momoTokenUrl,
            {},
            {
              headers: {
                'Cache-Control': 'no-cache',
                'Ocp-Apim-Subscription-Key': process.env.REACT_APP_SUBSCRIBE_KEY,
                Authorization: `Basic ${btoa(process.env.REACT_APP_X_REFERENCE_ID+':'+process.env.REACT_APP_API_KEY)}`,
              },
            }
        );
        //console.log(momoTokenResponse.data);
        momoToken = momoTokenResponse.data.access_token;
        localStorage.setItem('momoToken', momoToken)
        return momoToken
    } catch (error) {
        console.error(`An error occur : ${error}`);
    }
}

export const requestTopay=async(momoToken, total, phone, currency)=>{

    let ID = uuid();
    localStorage.setItem('transactionId', ID)

    try {
        if (!momoToken) {
          console.log(`error: MoMo token not available`);
        }
    
        const body = {
          amount: total,
          currency: currency ? currency : 'EUR',
          externalId: CodeGenerator(9),
          payer: {
            partyIdType: 'MSISDN',
            partyId: phone,
          },
          payerMessage: 'Paiement de machine Ctlab',
          payeeNote: 'Paiement de machine Ctlab',
        };
    
        const momoResponse = await axios.post(
          momoRequestToPayUrl,
          body,
          {
            headers: {
                'X-Reference-Id': ID,
                'X-Target-Environment': 'sandbox',
                'Ocp-Apim-Subscription-Key': process.env.REACT_APP_SUBSCRIBE_KEY,
                Authorization: `Bearer ${momoToken}`,
                'Content-Type': 'application/json',
            },
          }
        );

        return(momoResponse.data);
      } catch (error) {

        console.error(`An error occur : ${error}`);
      }
}


export const getRequestTopayStatut =async ()=>{

  let ID = localStorage.getItem('transactionId');
  let token = localStorage.getItem('momoToken')

  try {
    const momoPayementStatut = await axios.get(
            `${momoRequestToPayUrl}/${ID}`,
            {
              headers: {
                'Cache-Control': 'no-cache',
                'Ocp-Apim-Subscription-Key': process.env.REACT_APP_SUBSCRIBE_KEY,
                'X-Target-Environment': 'sandbox',
                Authorization: `Bearer ${token}`,
              },
            }
        );
        //console.log(momoPayementStatut.data);
        let momoresp = momoPayementStatut?.data;
        return momoresp
  } catch (error) {
    console.error(`An error occur : ${error}`);
  }

}