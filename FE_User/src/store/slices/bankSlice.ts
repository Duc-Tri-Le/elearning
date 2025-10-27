"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type Bank = {
    bank_id: number;
    description: string;
    topic_id?: number;
    available : boolean
};

type BankState = {
    banks : Bank[]    
}

const initialState : BankState = {
    banks : []
}

const bankSlice = createSlice({
    name : "bank",
    initialState,
    reducers : {
        setBank(state, action : PayloadAction<Bank[]>){
            state.banks = action.payload
        },

        clearBank: (state) => {
            state.banks = [];
        },
    }
})

export const {setBank, clearBank} = bankSlice.actions
export const bankReducer = bankSlice.reducer