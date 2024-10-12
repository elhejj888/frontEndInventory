import card from "@material-tailwind/react/theme/components/card";
import Card from "./card";

export default function CardContainer({ cardsData, handleDelete, handleEdit , role }) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {cardsData.map((cardData, index) => (
          <Card
            key={cardData.id}
            infos={cardData}
            handleDelete={() => handleDelete(cardData.id)}
            handleEdit={handleEdit}
            handlePanne={cardData.handlePanne}
            role={role}
          />
        ))}
      </div>
    );
  }
  