import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    fonts: {
      heading: `Poppins`,
      body: `Poppins, sans-serif`,
    },
  
  
})


export function setupInterval (callback, interval, name) {
    var key = '_timeInMs_' + (name || '');
    var now = Date.now();
    var timeInMs = localStorage.getItem(key);
    var executeCallback = function () {
      localStorage.setItem(key, Date.now());
      callback();
    }
    if (timeInMs) { // User has visited
      var time = parseInt(timeInMs);
      var delta = now - time;
      if (delta > interval) { // User has been away longer than interval
        setInterval(executeCallback, interval);
      } else { // Execute callback when we reach the next interval
        setTimeout(function () {
          setInterval(executeCallback, interval);
          executeCallback();
        }, interval - delta);
      }
    } else {
      setInterval(executeCallback, interval);
    }
    localStorage.setItem(key, now);
}
  
  

export const containerVariant={
    hidden: {
      opacity: 0,
      x: '100vw',
     
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
          ease: 'linear',
          delay: 0.3,
        }
    }
  }



export function CodeGenerator(number){
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < number; i++ ) {
        OTP += digits[Math.floor(Math.random() * (digits.length))];
    }
    return OTP;
}


export function kFormatter(num) {

    if(Math.abs(num) <= 999){
       return Math.sign(num)*Math.abs(num)
    }else if(Math.abs(num) > 999 && Math.abs(num) < 999999){
        return Math.sign(num)*((Math.abs(num)/1000).toFixed(2)) + 'K'
    }else{
        return Math.sign(num)*((Math.abs(num)/1000000).toFixed(5)) + 'M'
    }
}