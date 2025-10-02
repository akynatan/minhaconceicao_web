import React from "react";
import FormPlaceToSleep from "../../components/FormPlaceToSleep";

const AddPlaceToSleep: React.FC = () => {
  return (
    <FormPlaceToSleep
      method="add"
      url="/places-to-sleep"
      initialData={undefined}
    />
  );
};

export default AddPlaceToSleep;
