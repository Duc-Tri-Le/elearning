"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Document = {
  document_id: number;
  title: string;
  link?: string;
  created_at: string;
  topic_id?: number | null;
};

type DocumentState = {
  documents: Document[];
};

const initialState: DocumentState = {
  documents: [],
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setDocument(state, action: PayloadAction<Document[]>) {
      state.documents = action.payload;
    },

    clearDocument(state) {
      state.documents = [];
    },
  },
});

export const { setDocument, clearDocument } = documentSlice.actions;
export const documentReducer = documentSlice.reducer;
