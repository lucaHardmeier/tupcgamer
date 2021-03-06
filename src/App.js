import NavBar from "./components/NavBar";
import UserImg from "./assets/img/usuario/usernamemini.jpg"
import Cart from "./components/Cart";
import Main from "./components/Main"
import ItemDetailContainer from "./components/ItemDetailContainer"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import CartContext from "./components/CartContext";
import ItemAddModal from "./components/ItemAddModal";
import ItemDeleteModal from "./components/ItemDeleteModal";
import Order from "./components/Order";
import Login from "./components/Login";
import Signin from "./components/Signin";
import PurchaseForm from "./components/PurchaseForm";
import Perfil from "./components/Perfil";

function App() {

    const [infoUsuario, setInfoUsuario] = useState({});
    const { user, nombre } = infoUsuario
    const img = UserImg

    const [itemAddModal, setItemAddModal] = useState(false)
    const [itemDeleteModal, setItemDeleteModal] = useState(false)
    const [itemToDelete, setItemToDelete] = useState({})

    const [order, setOrder] = useState({})
    const [orderId, setOrderId] = useState("")

    const [search, setSearch] = useState("");

    if (Object.entries(infoUsuario).length === 0 && sessionStorage.getItem("user")) setInfoUsuario(JSON.parse(sessionStorage.getItem("user")))

    return (
        <CartContext>
            <BrowserRouter>
                <NavBar user={user} img={img} setInfoUsuario={setInfoUsuario} setSearch={setSearch} search={search} />
                <Routes>
                    <Route path="/" element={<Main search={search} nombre={nombre} />} />
                    <Route path="/cat/:tag" element={<Main search={search} />} />
                    <Route path="/item/:id" element={<ItemDetailContainer setItemAddModal={setItemAddModal} user={user} />} />
                    <Route path="/cart" element={<Cart setItemDeleteModal={setItemDeleteModal} setItemToDelete={setItemToDelete} />} />
                    <Route path="/purchase" element={<PurchaseForm infoUsuario={infoUsuario} setOrder={setOrder} setOrderId={setOrderId} />} />
                    <Route path="/order/:id" element={<Order order={order} orderId={orderId} />} />
                    <Route path="/mi-perfil" element={<Perfil infoUsuario={infoUsuario} setOrder={setOrder} setOrderId={setOrderId} />} />
                    <Route path="/login" element={<Login setInfoUsuario={setInfoUsuario} />} />
                    <Route path="/signin" element={<Signin />} />
                </Routes>
                {itemAddModal && <ItemAddModal setItemAddModal={setItemAddModal} user={user} />}
                {itemDeleteModal && <ItemDeleteModal setItemDeleteModal={setItemDeleteModal} itemToDelete={itemToDelete} />}
            </BrowserRouter>
        </CartContext>

    )
}

export default App;