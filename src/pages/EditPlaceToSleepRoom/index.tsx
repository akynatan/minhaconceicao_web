import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import FormPlaceToSleepRoom, {
  FormPlaceToSleepRoomInitialData,
} from "../../components/FormPlaceToSleepRoom";
import { PlaceToSleepRoom } from "../../types/PlaceToSleepRoom";
import { toTimeInput } from "../../utils/stayInfo";

const EditPlaceToSleepRoom: React.FC = () => {
  const { id, roomId } = useParams<{ id: string; roomId: string }>();
  const [room, setRoom] = useState<FormPlaceToSleepRoomInitialData>();
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const response = await api.get<PlaceToSleepRoom>(`/rooms/${roomId}`);
        const roomData = response.data;

        if (id && roomData.placeToSleepId && roomData.placeToSleepId !== id) {
          addToast({
            type: "error",
            title: "Quarto não encontrado",
            description: "Este quarto não pertence a esta hospedagem",
          });
          return;
        }

        setRoom({
          name: roomData.name || "",
          description: roomData.description || "",
          capacity:
            roomData.capacity === undefined || roomData.capacity === null
              ? ""
              : String(roomData.capacity),
          beds: roomData.beds || "",
          slug: roomData.slug || "",
          position:
            roomData.position === undefined || roomData.position === null
              ? "0"
              : String(roomData.position),
          tags: roomData.tags?.map((item) => item.tagId) || [],
          images: roomData.images || [],
          rules:
            roomData.rules?.map((rule) => ({
              text: rule.text || "",
              isAllowed: Boolean(rule.isAllowed),
              icon: rule.icon || "",
            })) || [],
          checkInTime: toTimeInput(roomData.checkInTime),
          checkOutTime: toTimeInput(roomData.checkOutTime),
          breakfastInfo: roomData.breakfastInfo || "",
          petPolicy: roomData.petPolicy || "",
        });
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: getApiErrorMessage(
            error,
            "Erro ao carregar dados do quarto"
          ),
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (roomId) {
      loadRoom();
    } else {
      setIsLoading(false);
    }
  }, [addToast, id, roomId]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!room || !id || !roomId) {
    return <div>Quarto não encontrado</div>;
  }

  return (
    <FormPlaceToSleepRoom
      method="edit"
      url={`/rooms/${roomId}`}
      placeToSleepId={id}
      initialData={room}
    />
  );
};

export default EditPlaceToSleepRoom;
