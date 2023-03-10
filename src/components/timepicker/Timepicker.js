import React ,{useEffect, useState} from "react";
import './timepicker.scss'
import {Modal} from "../modal/Modal.js";
import {ReactComponent as ClockIcon} from "./clock.svg";
import {ReactComponent as KeyBoardIcon} from "./keyboard.svg";
import Digital from "../digital/Digital.js";
import Analog from "../analog/Analog.js";
import {ThemeProvider, useTheme} from "../../ThemeContext.js";
import Button from "../button/Button.js";
import {decode} from "../../utilities.js";

const TimePicker = props=>(<ThemeProvider><ActualTimePicker {...props} /></ThemeProvider>)

function ActualTimePicker( props ) {

    const [ time,setTime ]= useState( '0000');
    const [ mode,setMode ]= useState('hours');
    const [ clockDisplay,setClockDisplay ] = useState(false);
    const [ dayMode,setDayMode ]= useState('am');
    const [ colors , setTheme, setColors ] = useTheme()

    useEffect(()=>{
        if( props.theme) setTheme( props.theme );
    },[ setTheme,props.theme ])

    useEffect(()=>{
        if( typeof props.colors !== "undefined"){
            setColors (props.colors)
        }
    },[ props.colors,setColors ])

    useEffect(()=>{
        if( typeof time !== 'undefined') {
            props.onChange( time  )
        }

    },[ time,props ])

    useEffect( ()=>{

        if( typeof props.defaultValue !== "undefined" ){

            if( props.defaultValue.length === 4 && Number(props.defaultValue) < '2359'){
                setTime( props.defaultValue )

                if(decode( props.defaultValue ).hour >= 12) setDayMode('pm')
                else setDayMode('am')
            }
        }
    },[ props.defaultValue,setDayMode ])

    return (
            <div className='time-picker-component'
                style={{...(props.style || {})}}
            >
                    <Modal show={ props.show }
                           hide={ props.hide }
                           zIndex ={ props.zIndex || 1002 }
                           style={ props.style }
                           width={ props.width }
                           top={ props.top }
                    >
                        <span className='title labels'>
                            { props.title || 'Enter time' }
                        </span>
                        <Digital mode={ mode }
                                 time={ time }
                                 onChange={ setTime }
                                 setMode={ setMode }
                                 dayMode={ dayMode }
                                 setDayMode={ setDayMode }
                        />
                        { clockDisplay === true
                            ? <Analog time={ time }
                                      dayMode={ dayMode }
                                      onChange={ setTime }
                                      mode={ mode }
                                      clockWidth={ props.clockWidth || '' }
                            />
                            : ''
                        }
                        <div className='footer'
                             style={{ fill:`${ colors.onSurfaceVariant }`}}
                        >
                            { clockDisplay === false
                                ? <ClockIcon onClick={ ()=> setClockDisplay(true) }/>
                                : <KeyBoardIcon onClick={ ()=> setClockDisplay(false)}/>
                            }
                            <div id='btns'>
                                { props.buttons.map(x=>
                                    <Button key={x.label}
                                            type='text'
                                            click={ x.onClick }
                                    >
                                        { x.label }
                                    </Button>
                                ) }
                            </div>
                        </div>
                    </Modal>
            </div>
    )
}

export default TimePicker;