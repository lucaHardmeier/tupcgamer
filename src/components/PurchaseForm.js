import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useContext, useReducer, useState } from "react";
import { context } from "./CartContext";
import { coleccionOrdenes, database } from "./firebase";
import { useNavigate } from "react-router-dom"

const reducer = (state, action) => {
    const { name, value } = action
    return {
        ...state,
        [name]: value
    }
}

const PurchaseForm = ({ infoUsuario, setOrder, setOrderId }) => {
    let navigate = useNavigate()

    const { nombre, apellido, email, pais, provincia, ciudad, direccion, telefono } = infoUsuario

    const initialState = {
        nombre,
        apellido,
        email,
        pais,
        provincia,
        ciudad,
        direccion,
        telefono
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    //Validaciones
    const [emailVal, setEmailVal] = useState(true);
    const [nombreVal, setNombreVal] = useState(true);
    const [apellidoVal, setApellidoVal] = useState(true);
    const [paisVal, setPaisVal] = useState(true);
    const [provinciaVal, setProvinciaVal] = useState(true);
    const [ciudadVal, setCiudadVal] = useState(true);
    const [direccionVal, setDireccionVal] = useState(true);
    const [telefonoVal, setTelefonoVal] = useState(true);
    const validations = [emailVal, nombreVal, apellidoVal, paisVal, provinciaVal, ciudadVal, direccionVal, telefonoVal]

    const handleChange = (e) => {
        const { value, name } = e.target
        dispatch({ name, value })
    }

    const { cartItems, totalPrice, cantidadTotal, cartReducer } = useContext(context)

    const handleSubmit = (e) => {
        e.preventDefault()
        const { nombre, apellido, email, pais, provincia, ciudad, direccion, telefono } = state
        console.log(state)
        console.log(email)
        setEmailVal(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim()))
        setNombreVal(/[a-zA-Z ]$/.test(nombre.trim()))
        setApellidoVal(/[a-zA-Z ]$/.test(apellido.trim()))
        setPaisVal(/[a-zA-Z ]$/.test(pais.trim()))
        setProvinciaVal(/[a-zA-Z ]$/.test(provincia.trim()))
        setCiudadVal(/[a-zA-Z ]$/.test(ciudad.trim()))
        setDireccionVal(/[a-zA-Z0-9 ]$/.test(direccion.trim()))
        setTelefonoVal(/[0-9-+]$/.test(telefono.trim()))

        if (!validations.some(val => !val)) {

            const usuario = {
                nombre: nombre.trim() + " " + apellido.trim(),
                email: email.trim(),
                pais: pais.trim(),
                provincia: pais.trim(),
                ciudad: ciudad.trim(),
                direccion: direccion.trim(),
                telefono: telefono.trim()
            }
            const compra = {
                usuario,
                cartItems,
                totalPrice,
                cantidadTotal,
                created_at: serverTimestamp()
            }
            setOrder(compra)
            const orden = addDoc(coleccionOrdenes, compra)
            orden
                .then((resultado) => {
                    cartReducer({
                        status: "quitarTodo"
                    })
                    setOrderId(resultado.id)
                    navigate(`/order/${resultado.id}`)
                })
                .catch((error) => {
                })
        }
    }


    return (
        <main>
            <h3>¡Los productos casi son tuyos!</h3>
            <h4>Antes de terminar, te pedimos que verifiques tu información para que el producto te llegue correctamente.</h4>
            <form className='formContainer' onSubmit={handleSubmit}>
                <div className='formItem'>
                    <label htmlFor="email" className='formContainer__text'>Email:</label>
                    <input type="text" name="email" className="formInput" value={state.email} onChange={handleChange} />
                    {emailVal || <p className='errorMsj'>Ingrese un email válido.</p>}
                </div>
                <div className='formItem'>
                    <label htmlFor="nombre" className='formContainer__text'>Nombre:</label>
                    <input type="text" name="nombre" className="formInput" value={state.nombre} onChange={handleChange} />
                    {nombreVal || <p className='errorMsj'>Ingrese un nombre válido.</p>}
                </div>
                <div className='formItem'>
                    <label htmlFor="apellido" className='formContainer__text'>Apellido:</label>
                    <input type="text" name="apellido" className="formInput" value={state.apellido} onChange={handleChange} />
                    {apellidoVal || <p className='errorMsj'>Ingrese un apellido válido.</p>}
                </div>
                <div className='formItem'>
                    <label htmlFor="pais" className='formContainer__text'>Pais de residencia:</label>
                    <input type="text" name="pais" className="formInput" value={state.pais} onChange={handleChange} />
                    {paisVal || <p className='errorMsj'>Ingrese un nombre de país válido.</p>}
                </div>
                <div className='formItem'>
                    <label htmlFor="provincia" className='formContainer__text'>Provincia:</label>
                    <input type="text" name="provincia" className="formInput" value={state.provincia} onChange={handleChange} />
                    {provinciaVal || <p className='errorMsj'>Ingrese un nombre de provincia válida.</p>}
                </div>
                <div className='formItem'>
                    <label htmlFor="ciudad" className='formContainer__text'>Ciudad:</label>
                    <input type="text" name="ciudad" className="formInput" value={state.ciudad} onChange={handleChange} />
                    {ciudadVal || <p className='errorMsj'>Ingrese un nombre de ciudad válida.</p>}
                </div>
                <div className='formItem'>
                    <label htmlFor="direccion" className='formContainer__text'>Dirección:</label>
                    <input type="text" name="direccion" className="formInput" value={state.direccion} onChange={handleChange} />
                    {direccionVal || <p className='errorMsj'>Ingrese una dirección válida.</p>}
                </div>
                <div className='formItem'>
                    <label htmlFor="telefono" className='formContainer__text'>Teléfono:</label>
                    <input type="text" name="telefono" className="formInput" value={state.telefono} onChange={handleChange} />
                    {telefonoVal || <p className='errorMsj'>Ingrese un número de teléfono válido.</p>}
                </div>
                <div>
                    <button type='formInput logBtn' className='btn'>Confirmar compra</button>
                </div>
            </form>

        </main>
    );
};

export default PurchaseForm;