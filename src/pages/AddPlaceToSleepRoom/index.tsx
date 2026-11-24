import React from "react";
import { useParams } from "react-router";

import FormPlaceToSleepRoom from "../../components/FormPlaceToSleepRoom";

const AddPlaceToSleepRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Local não encontrado</div>;
  }

  return (
    <FormPlaceToSleepRoom
      method="add"
      url="/rooms"
      placeToSleepId={id}
      initialData={undefined}
    />
  );
};

export default AddPlaceToSleepRoom;
