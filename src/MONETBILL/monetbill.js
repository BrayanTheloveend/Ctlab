import axios from "axios"

const monetbillUrlBase = 'https://api.monetbil.com/payment/v1'
const paymentUrl = `${monetbillUrlBase}/placePayment`
const checkStatusPaymentUrl = `${monetbillUrlBase}/checkPayment`
const getDetailsPaymentUrl = `https://fr.monetbil.bj/checkPayment`

const paymentMonetbillWidget = 'https://api.monetbil.com/widget/v2.1/{service_key}' 




export const requesttopay= async(mobile, amount, country, currency)=>{

    const body = {
        service: process.env.REACT_APP_MONETBILL_SECRET_KEY,
        phonenumber: mobile,
        amount: amount,
        country: country,
        currency: currency,
        notify_url: "http://localhost:3000/monetbil/notifications"
    }
    try {
        const triggerPayment = await axios.post(
            paymentUrl,
            body,
            {
                headers:{
                    'Content-Type': 'application/json',
                }
            }
        )
        let response = triggerPayment.data
        localStorage.setItem('momoToken', response?.paymentId)
        console.log(response)

        return response
    } catch (error) {
        console.log(error.message)
    }

}

export const requesttopayUsingWidget= async(mobile, amount, country, currency)=>{

    const body = {
        phonenumber: mobile,
        amount: amount,
        country: country,
        currency: currency,
        notify_url: "http://localhost:3000/monetbil/notifications"
    }
    try {
        const triggerPayment = await axios.post(
            paymentMonetbillWidget,
            body,
            {
                headers:{
                    'Content-Type': 'application/json',
                }
            }
        )
        let response = triggerPayment.data
        localStorage.setItem('momoToken', JSON.stringify(response))
        console.log(response)

        return response
    } catch (error) {
        console.log(error.message)
    }

}


export const getRequestTopayStatut =async ()=>{
    let paymentId = localStorage.getItem('momoToken')

    try {
        const momoPayementStatut = await axios.post(
                checkStatusPaymentUrl,
                JSON.stringify({paymentId: paymentId,  service: process.env.REACT_APP_MONETBILL_SECRET_KEY }),
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
            );
            console.log(momoPayementStatut.data);
            let momoresp = momoPayementStatut;
            return momoresp
      } catch (error) {
        console.error(`An error occur : ${error}`);
      }
    


}


