import { useEffect, useState } from "react";
import { PokemonContext } from "./PokemonContext";
import { useForm } from "../hook/useForm";

export const PokemonProvider = ({ children }) => {
  //guardar los pokemones
  const [allPokemons, setAllPokemons] = useState([]);
  //Global pokemons
  const [globalPokemons, setGlobalPokemons] = useState([]);
  //limitar la cantidad y definir el inicio
  const [offset, setOffset] = useState(0);

  //Customhook useform
  const { valueSearch, onInputChange, onResetForm } = useForm({
    valueSearch: "",
  });

  //Estados simples
  //de carga
  const [loading, setLoading] = useState(true);
  //filtrado
  const [active, setActive] = useState(false);

  //Llamar 50 pokemons de la API
  //offset el inicio(donde quiero que empiece 0) y el limit su limite 50

  const getAllPokemons = async (limit = 52) => {
    const URL = "https://pokeapi.co/api/v2/";
    const res = await fetch(`${URL}pokemon?limit=${limit}&offset=${offset}`);
    const data = await res.json();

    const promise = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(promise);

    setAllPokemons([...allPokemons, ...results]);
    setLoading(false);
  };

  //Llamar a todos los pokemones, el filtro y busqueda no sera dentro e los 50
  //sino en todo el directorio de la API
  const getGlobalPokemons = async () => {
    const URL = "https://pokeapi.co/api/v2/";
    const res = await fetch(`${URL}pokemon?limit=100000&offset=0`);
    const data = await res.json();

    const promise = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      return data;
    });

    const results = await Promise.all(promise);
    setGlobalPokemons(results);
    setLoading(false);
  };

  //Llamar a un pokemon por ID
  const getPokemonById = async (id) => {
    const URL = "https://pokeapi.co/api/v2/";
    const res = await fetch(`${URL}pokemon/${id}`);
    const data = await res.json();
    return data;
  };

  /*Este useefect tiene uan dependencia, offset,
   cada vez que offset cambien vuelve a ejecutar o llmar a la funcion 
   que hace el llamado a la api*/
  useEffect(() => {
    getAllPokemons();
  }, [offset]);

  useEffect(() => {
    getGlobalPokemons();
  }, []);

  //BTN cargar mas
  const onClickLoadMore = () => {
    setOffset(offset + 52);
  };

  // Filter function + state

  const [typeSelected, setTypeSelected] = useState({
    grass: false,
    normal: false,
    fighting: false,
    flying: false,
    poison: false,
    ground: false,
    rock: false,
    bug: false,
    ghost: false,
    steel: false,
    fire: false,
    water: false,
    electric: false,
    psychic: false,
    ice: false,
    dragon: false,
    dark: false,
    fairy: false,
    unknow: false,
    shadow: false,
  });

  const [filteredPokemons, setFilteredPokemons] = useState([]);

  const handleCheckbox = (e) => {
    setTypeSelected({
      ...typeSelected,
      [e.target.name]: e.target.checked,
    });

    if (e.target.checked) {
      const filteredResults = globalPokemons.filter((pokemon) =>
        pokemon.types
        .map(type => type.type.name)
        .includes(e.target.name)
      );
      setFilteredPokemons([...filteredPokemons, ...filteredResults]);
    } else { 
      const filteredResults = filteredPokemons.filter((pokemon) =>
        !pokemon.types
        .map(type => type.type.name)
        .includes(e.target.name)
      );
      setFilteredPokemons([...filteredResults]);
    }
  };

  return (
    <PokemonContext.Provider
      value={{
        valueSearch,
        onInputChange,
        onResetForm,
        allPokemons,
        globalPokemons,
        getPokemonById,
        onClickLoadMore,
        // Loader
        loading,
        setLoading,
        // Btn filter
        active,
        setActive,
        // Filter container checkbox
        handleCheckbox,
        filteredPokemons,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};
