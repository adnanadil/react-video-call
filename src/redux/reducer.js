import { createSlice } from "@reduxjs/toolkit";

export const mySlice = createSlice({
  name: "mySlice",
  initialState: {
    useRobot: false,
  },
  reducers: {
    useRobotAction: (state, action) => {
      state.useRobot = action.payload;
    },
  },
});

export const { useRobotAction } = mySlice.actions;

export default mySlice.reducer;
