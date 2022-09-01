import img from './giphy.gif';

const ErrorMessage = () => {
    return (
       <img src={img} alt="#"  
       style={{display: 'block', width: "250px", height: "250px", margin: "0 auto", objectFit: 'contain'}}/>
    )
}
export default ErrorMessage;

