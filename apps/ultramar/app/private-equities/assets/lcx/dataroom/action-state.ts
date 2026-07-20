export type DataRoomActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

export const initialDataRoomActionState: DataRoomActionState = {
  status: "idle",
  message: "",
};
