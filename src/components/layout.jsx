import SideBar from "./sideBar";
import Content from "./content";
import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";

function Layout() {
  const [cards, setCards] = useState([]);
  const cardsArr = useRef([]);

  const onSearch = useCallback((value) => {
    setCards(
      cardsArr.current.filter((card) =>
        card.title.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  }, []);

  useEffect(() => {
    axios.get("http://localhost:4000/cards").then((res) => {
      setCards(res.data);
      cardsArr.current = res.data;
    });
  }, []);

  const onAddCard = useCallback((card) => {
    setCards([...cards, { ...card, id: uuid() }]);
    axios
      .post("http://localhost:4000/cards", card)
      .then((res) => console.log(res.data));
  }, [cards]);

  return (
    <div className="grid grid-cols-[320px_1fr] gap-8 max-w-screen-xl mx-auto mt-10 mb-10 px-6">
      <SideBar onAddCard={onAddCard} />
      <Content cards={cards} onSearch={onSearch} />
    </div>
  );
}

export default Layout;
