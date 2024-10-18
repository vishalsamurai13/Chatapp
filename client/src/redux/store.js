import { configureStore } from "@reduxjs/toolkit";

import loaderReducer from './loaderSlice';

const store = configureStore({
    reducer: { loaderReducer }
});

export default store;