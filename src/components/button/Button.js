import './button.scss'
import {useTheme} from "../../ThemeContext.js";

export default function Button(props) {
    const [ colors ] =useTheme();
    const styles = {
        outline : {
            border: `2px solid ${colors.outline}`,
            color : colors.primary
        },
        filled : {
            color : colors.onPrimary,
            backgroundColor: colors.primary,
            border: 'none',
        },
        text : {
            color : colors.primary,
            ':hover':{
                backgroundColor: colors.primary,
                opacity:.08
            }

        }
    }
    const buttonStyle = styles[ props.type ];
    const handleClick =(e)=>{

        e.stopPropagation();
        props.click();
    }
    return <div className='buttons'>
        <button className = { typeof props.size !== 'undefined'
                    ? props.type+' btn '+props.size
                    : props.type+' btn'
                }
                onClick = { handleClick }
                style={ buttonStyle }
        >
            { props.children }
        </button>
    </div>
}


