import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { Navegation } from "./components/Navegation";
import { HomePage, PokemonPage, SearchPage } from "./pages"

//La primera ruta es el elemento que se renderiza en todas las paginas, navegacion(el header)
export const AppRouter = () => {
    return <Routes>
        <Route path="/" element={<Navegation/>}>
            <Route index element={<HomePage/>} /*homepage*//>
            <Route path="pokemon/:id" element={<PokemonPage/>}/>
            <Route path="search" element={<SearchPage/>}/>
        </Route>
        <Route path="*" element={<Navigate to ="/"/>} /*ruta por si no encuentra*//>
    </Routes>
}