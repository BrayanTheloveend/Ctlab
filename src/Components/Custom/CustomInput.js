import { Input } from '@chakra-ui/react'
import React from 'react'

const CustomInput = (props) => {
  return (
    <div className="form__group field">
        <Input type={props.type ? props.type : 'text'} 
        className="form__field" onChange={props.onChange} 
        value={props.value} placeholder={props.placeholder} 
        name={props.name} 
        id={props.name} 
        required ={props.isRequired} 
        borderTop={'none'}
        bg={'gray.700'}
        color={'white'}
        borderLeft={'none'}
        borderRight={'none'}
        rounded={'none'}
        _focusVisible={{
          outline: 'none',
        }}
        />
        {props.textHelper  && <small>{props.textHelper}</small>}
        <label htmlFor="name" className="form__label">{props.label}</label>
        
    </div>
  )
}
export default CustomInput
