import {Input} from "../input/Input.js";
import './digital.scss';
import {useState} from "react";
import {decode,normalize} from "../../utilities.js";
import {useTheme} from "../../ThemeContext.js";

export default function Digital(props ) {

    const [ colors ] = useTheme();
    const [ msg,setMsg ] = useState('');
    const [ inpHoursError,setInpHoursError ] = useState(false);
    const [ inpMinutesError,setInpMinutesError ] = useState(false);
    const dayMode = props.dayMode;

    function handleTimeChange(e,mode) {
        const inputNumericValue = parseInt(e.target.value);
        if( isNaN(inputNumericValue) ) {

            setMsg( 'Entered value can be only a number.');
            ( mode === 'hours' ? setInpHoursError(true) : setInpMinutesError(true))
            return;
        }
        if( mode === 'hours') {
            setInpHoursError(false)
            const minutesVal = decode( props.time || 0).minute;
            const maxHour = (dayMode === 'pm' ? 23 : 11);

            if ( inputNumericValue > maxHour ) {

                setMsg(`Invalid input: "Hours" is not allowed to be greater than 12`)
                setInpHoursError(true);
            }

            const val = normalize( Math.min( inputNumericValue, maxHour ) )
            props.onChange(`${ val }${ minutesVal }`)

        } else {
            setInpMinutesError(false)
            const maxMinutes = 59;
            if (inputNumericValue > maxMinutes) {

                setMsg('Invalid input: "Minutes" is not allowed to be greater than 60.')
                setInpMinutesError(true);
            }

            const minutesVal = normalize( Math.min(inputNumericValue, maxMinutes ) )
            props.onChange(`${ decode( props.time || 0).hour}${ minutesVal }`)

        }
    }

    function handleDayModeChange() {

        let time = decode( props.time);
        let hourValue = Number(time.hour);

        if( dayMode === 'am' ){

            hourValue = hourValue === 12 ? 12 : normalize(hourValue + 12)
            props.setDayMode('pm');

        }else if( dayMode === 'pm'){

            hourValue = normalize(hourValue % 12);
            props.setDayMode('am')
        }
        props.onChange( `${ hourValue }${ time.minute }` )
    }

    return (<><div className='digital-clock-component'>
            <div className= 'inps-container'>
                <Input value={ normalize( decode( props.time || 0).hour%12) }
                       onChange={ e => handleTimeChange( e,'hours' ) }
                       onClick={ ()=> props.setMode( 'hours' ) }
                       className={ props.className }
                       onBlur={ ()=> {
                           setMsg('');
                           setInpHoursError(false);
                       } }
                       error={ inpHoursError }
                       active = {props.mode === 'hours'}
                />
                <div className='labels'>
                    { props.label1 || 'Hours' }
                </div>
            </div>
            :
            <div className= 'inps-container'>
                <Input value={ decode( props.time || 0).minute }
                       onChange={ e => handleTimeChange( e,'minutes') }
                       onClick={ ()=> props.setMode( 'minutes' ) }
                       className={ props.className }
                       onBlur={ ()=> {
                           setMsg('');
                           setInpMinutesError(false);
                       } }
                       error={ inpMinutesError }
                       active = { props.mode === 'minutes' }
                />
                <div className='labels'>
                    { props.label2 || 'Minutes' }
                </div>
            </div>
            <div className='switch'
                 style={{
                    border: `1px solid ${colors.outline}`
                }}
            >
                <div style={{ backgroundColor : props.dayMode === 'am'
                        ? colors.tertiaryContainer
                        : ''
                    }}
                    className='up'
                     onClick={ handleDayModeChange }
                >AM
                </div>
                <div style={{ backgroundColor : props.dayMode === 'pm'
                        ? colors.tertiaryContainer
                        : ''
                    }}
                    className='down'
                     onClick={ handleDayModeChange }
                >PM
                </div>
            </div>
        </div>
    <div className='msg' style={{ color:colors.error }}>
        { msg }
    </div>
    </>)
}
