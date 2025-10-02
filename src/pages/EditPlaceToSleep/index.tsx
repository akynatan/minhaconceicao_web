import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../services/api";
import { PlaceToSleep } from "../../types/PlaceToSleep";
import FormPlaceToSleep from "../../components/FormPlaceToSleep";
import { useToast } from "../../hooks/toast";

const EditPlaceToSleep: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [placeToSleep, setPlaceToSleep] = useState<PlaceToSleep | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadPlaceToSleep = async () => {
      try {
        const response = await api.get(`/places-to-sleep/${id}`);
        const placeToSleepData = response.data;

        const mappedData = {
          ...placeToSleepData,
          latitude: placeToSleepData.latitude?.toString() || "",
          longitude: placeToSleepData.longitude?.toString() || "",
          categories:
            placeToSleepData.categories?.map((cat: any) => cat.categoryId) ||
            [],
          images: placeToSleepData.images || [],
          schedules:
            placeToSleepData.schedules?.map((schedule: any) => ({
              dayOfWeek: schedule.dayOfWeek,
              openingTime: schedule.openingTime?.substring(0, 5) || "08:00",
              closingTime: schedule.closingTime?.substring(0, 5) || "18:00",
              isClosed: schedule.isClosed || false,
            })) || [],
        };

        setPlaceToSleep(mappedData);
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar dados do local",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadPlaceToSleep();
    }
  }, [id, addToast]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!placeToSleep) {
    return <div>Local não encontrado</div>;
  }

  return (
    <FormPlaceToSleep
      method="edit"
      url={`/places-to-sleep/${id}`}
      initialData={placeToSleep}
    />
  );
};

export default EditPlaceToSleep;
