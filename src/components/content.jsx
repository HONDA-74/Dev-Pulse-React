import { memo } from "react";
import Card from "./card";
import Search from "./search";

function Content(props) {
  const onSearch = (value) => {
    props.onSearch(value);
  };

  return (
    <div>
      <Search onSearch={onSearch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {props.cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default memo(Content);
